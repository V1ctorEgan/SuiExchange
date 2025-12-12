// ============================================================================
// CONFIGURATION
// ============================================================================

export const CONFIG = {
  PACKAGE_ID:
    "0xddda65f9f32984409cb14bb6ae3beda6c8d7d8b13a5300f388edac19c729b909",
  NETWORK: "testnet",
  WALRUS_PUBLISHER: "https://publisher.walrus-testnet.walrus.space",
  WALRUS_AGGREGATOR: "https://aggregator.walrus-testnet.walrus.space",
};
import { Transaction } from "@mysten/sui/transactions";
// ============================================================================
// WALRUS FUNCTIONS WITH IMPROVED ERROR HANDLING
// ============================================================================

/**
 * Upload data to Walrus with retry logic
 */
export async function uploadToWalrus(data, epochs = 100, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Walrus upload attempt ${attempt}/${maxRetries}`);

      const blob =
        data instanceof Blob
          ? data
          : new Blob([JSON.stringify(data)], { type: "application/json" });

      const form = new FormData();
      form.append("file", blob);
      form.append("epochs", epochs.toString());

      const response = await fetch(`${CONFIG.WALRUS_PUBLISHER}/v1/store`, {
        method: "POST",
        body: form,
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Walrus upload failed with status ${response.status}: ${text}`
        );
      }

      const result = await response.json();
      console.log("Walrus upload response:", result);

      const blobId =
        result.newlyCreated?.blobObject?.blobId ||
        result.blobObject?.blobId ||
        result.blobId;

      if (!blobId) {
        throw new Error(`Invalid Walrus response: ${JSON.stringify(result)}`);
      }

      return blobId;
    } catch (error) {
      lastError = error;
      console.error(`Upload attempt ${attempt} failed:`, error);

      if (error.name === "AbortError") {
        throw new Error(
          "Walrus upload timed out — network is probably unstable"
        );
      }

      if (attempt < maxRetries) {
        await new Promise((res) => setTimeout(res, attempt * 1500));
      }
    }
  }

  throw new Error(
    `Failed to upload to Walrus after ${maxRetries} attempts: ${lastError.message}`
  );
}

/**
 * Fetch data from Walrus
 */
export async function fetchFromWalrus(blobId) {
  try {
    const response = await fetch(`${CONFIG.WALRUS_AGGREGATOR}/v1/${blobId}`, {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`Walrus fetch failed: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return await response.json();
    }
    return await response.blob();
  } catch (error) {
    console.error("Error fetching from Walrus:", error);
    throw error;
  }
}

/**
 * Get image URL from Walrus blob ID
 */
export function getWalrusImageURL(blobId) {
  return `${CONFIG.WALRUS_AGGREGATOR}/v1/${blobId}`;
}

/**
 * Compress image before upload with validation
 */
export async function compressImage(file, maxWidth = 800) {
  return new Promise((resolve, reject) => {
    // Validate file
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    if (!file.type.startsWith("image/")) {
      reject(new Error("File must be an image"));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      reject(new Error("Image must be less than 10MB"));
      return;
    }

    console.log(`Compressing image: ${file.name} (${file.size} bytes)`);

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        console.log(`Original dimensions: ${width}x${height}`);

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        console.log(`Compressed dimensions: ${width}x${height}`);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }
            console.log(`Compressed size: ${blob.size} bytes`);
            resolve(blob);
          },
          "image/jpeg",
          0.8
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert SUI to MIST
 */
export function suiToMist(sui) {
  return Math.floor(sui * 1_000_000_000);
}

/**
 * Convert MIST to SUI
 */
export function mistToSui(mist) {
  return mist / 1_000_000_000;
}

/**
 * Format SUI amount for display
 */
export function formatSui(mist) {
  return (mist / 1_000_000_000).toFixed(4) + " SUI";
}

/**
 * Format wallet address for display (0x1234...5678)
 */
export function formatAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ============================================================================
// TEST WALRUS CONNECTION
// ============================================================================

/**
 * Test if Walrus is accessible
 */
export async function testWalrusConnection() {
  try {
    console.log("Testing Walrus connection...");

    // Try to upload a small test blob
    const testData = { test: "connection", timestamp: Date.now() };
    const blobId = await uploadToWalrus(testData, 1); // 1 epoch for test

    console.log("Walrus connection test successful:", blobId);
    return { success: true, blobId };
  } catch (error) {
    console.error("Walrus connection test failed:", error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// MARKETPLACE FUNCTIONS - Add to smInteractionFn.js
// ============================================================================

// ============================================================================
// SERVICE LISTING FUNCTIONS
// ============================================================================

/**
 * Create a service listing on the marketplace
 * @param {Object} listingData - { title, description, category, price, images }
 * @param {Function} signAndExecuteTransaction - Wallet function
 * @returns {Promise<Object>} Transaction result
 */
export async function createServiceListing(
  listingData,
  signAndExecuteTransaction
) {
  try {
    console.log("Creating service listing:", listingData);

    // Step 1: Create metadata JSON (store locally since Walrus has issues)
    const metadata = {
      title: listingData.title,
      description: listingData.description,
      category: listingData.category || "Other",
      images: listingData.images || [], // Store as base64 or URLs
      created_at: Date.now(),
    };

    // Use local blob ID instead of Walrus
    const localBlobId = `listing_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Store metadata in localStorage for now
    localStorage.setItem(localBlobId, JSON.stringify(metadata));

    // Step 2: Create transaction
    const tx = new Transaction();

    // Convert price from SUI to MIST
    const priceInMist = suiToMist(listingData.price);

    tx.moveCall({
      target: `${CONFIG.PACKAGE_ID}::listings::create_listing`,
      arguments: [tx.pure.string(localBlobId), tx.pure.u64(priceInMist)],
    });

    // Step 3: Execute transaction
    const result = await signAndExecuteTransaction({
      transaction: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });

    console.log("Service listing created:", result);
    return result;
  } catch (error) {
    console.error("Failed to create service listing:", error);
    throw new Error("Failed to create service listing: " + error.message);
  }
}

/**
 * Get all active service listings from blockchain
 * @param {Object} suiClient - Sui client instance
 * @returns {Promise<Array>} Array of listings
 */
export async function getAllServiceListings(suiClient) {
  try {
    console.log("Fetching service listings from blockchain...");

    // Query ListingCreated events
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${CONFIG.PACKAGE_ID}::listings::ListingCreated`,
      },
      limit: 50,
    });

    console.log("Found", events.data.length, "listing events");

    // Fetch listing objects
    const listings = await Promise.all(
      events.data.map(async (event) => {
        try {
          const listingId = event.parsedJson.listing_id;

          // Get the listing object
          const obj = await suiClient.getObject({
            id: listingId,
            options: { showContent: true },
          });

          if (!obj.data || !obj.data.content) return null;

          const fields = obj.data.content.fields;

          // Load metadata from localStorage (or Walrus if available)
          let metadata = {};
          try {
            const storedMetadata = localStorage.getItem(fields.walrus_blob_id);
            if (storedMetadata) {
              metadata = JSON.parse(storedMetadata);
            }
          } catch (err) {
            console.error("Failed to load metadata:", err);
          }

          return {
            listingId: listingId,
            seller: fields.seller,
            price: mistToSui(fields.price),
            active: fields.active,
            createdAt: fields.created_at,
            walrusBlobId: fields.walrus_blob_id,
            ...metadata,
          };
        } catch (error) {
          console.error("Error fetching listing:", error);
          return null;
        }
      })
    );

    // Filter out null values and inactive listings
    const activeListings = listings.filter((l) => l && l.active);
    console.log("Active listings:", activeListings.length);

    return activeListings;
  } catch (error) {
    console.error("Failed to fetch service listings:", error);
    return [];
  }
}

/**
 * Purchase a service
 * @param {string} listingId - Listing object ID
 * @param {number} priceInSUI - Price in SUI
 * @param {Function} signAndExecuteTransaction - Wallet function
 * @returns {Promise<Object>} Transaction result
 */
export async function purchaseService(
  listingId,
  priceInSUI,
  signAndExecuteTransaction
) {
  try {
    console.log("Purchasing service:", listingId, "for", priceInSUI, "SUI");

    const tx = new Transaction();

    // Convert price to MIST
    const priceInMist = suiToMist(priceInSUI);

    // Split coins for payment
    const [coin] = tx.splitCoins(tx.gas, [priceInMist]);

    // Call purchase function
    tx.moveCall({
      target: `${CONFIG.PACKAGE_ID}::listings::purchase_service`,
      arguments: [tx.object(listingId), coin],
    });

    const result = await signAndExecuteTransaction({
      transaction: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });

    console.log("Service purchased successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to purchase service:", error);
    throw new Error("Failed to purchase service: " + error.message);
  }
}

/**
 * Cancel a service listing
 * @param {string} listingId - Listing object ID
 * @param {Function} signAndExecuteTransaction - Wallet function
 * @returns {Promise<Object>} Transaction result
 */
export async function cancelServiceListing(
  listingId,
  signAndExecuteTransaction
) {
  try {
    console.log("Cancelling listing:", listingId);

    const tx = new Transaction();

    tx.moveCall({
      target: `${CONFIG.PACKAGE_ID}::listings::cancel_listing`,
      arguments: [tx.object(listingId)],
    });

    const result = await signAndExecuteTransaction({
      transaction: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });

    console.log("Listing cancelled:", result);
    return result;
  } catch (error) {
    console.error("Failed to cancel listing:", error);
    throw new Error("Failed to cancel listing: " + error.message);
  }
}

/**
 * Get user's purchase history
 * @param {Object} suiClient - Sui client instance
 * @param {string} userAddress - User's wallet address
 * @returns {Promise<Array>} Array of purchase receipts
 */
export async function getUserPurchases(suiClient, userAddress) {
  try {
    console.log("Fetching purchases for:", userAddress);

    // Get all PurchaseReceipt objects owned by user
    const objects = await suiClient.getOwnedObjects({
      owner: userAddress,
      filter: {
        StructType: `${CONFIG.PACKAGE_ID}::listings::PurchaseReceipt`,
      },
      options: { showContent: true },
    });

    const purchases = objects.data.map((obj) => {
      const fields = obj.data.content.fields;
      return {
        receiptId: obj.data.objectId,
        listingId: fields.listing_id,
        buyer: fields.buyer,
        seller: fields.seller,
        pricePaid: mistToSui(fields.price_paid),
        purchasedAt: fields.purchased_at,
      };
    });

    console.log("Found", purchases.length, "purchases");
    return purchases;
  } catch (error) {
    console.error("Failed to fetch purchases:", error);
    return [];
  }
}

/**
 * Get user's active listings
 * @param {Object} suiClient - Sui client instance
 * @param {string} sellerAddress - Seller's wallet address
 * @returns {Promise<Array>} Array of user's listings
 */
export async function getUserListings(suiClient, sellerAddress) {
  try {
    const allListings = await getAllServiceListings(suiClient);
    const userListings = allListings.filter((l) => l.seller === sellerAddress);
    console.log("User has", userListings.length, "listings");
    return userListings;
  } catch (error) {
    console.error("Failed to fetch user listings:", error);
    return [];
  }
}

/**
 * Filter listings by category
 * @param {Array} listings - All listings
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered listings
 */
export function filterListingsByCategory(listings, category) {
  if (!category || category.toLowerCase() === "all services") {
    return listings;
  }

  return listings.filter(
    (listing) =>
      listing.category?.toLowerCase() === category.toLowerCase() ||
      listing.title?.toLowerCase().includes(category.toLowerCase()) ||
      listing.description?.toLowerCase().includes(category.toLowerCase())
  );
}

/**
 * Search listings
 * @param {Array} listings - All listings
 * @param {string} searchTerm - Search query
 * @returns {Array} Filtered listings
 */
export function searchListings(listings, searchTerm) {
  if (!searchTerm) return listings;

  const query = searchTerm.toLowerCase();

  return listings.filter(
    (listing) =>
      listing.title?.toLowerCase().includes(query) ||
      listing.description?.toLowerCase().includes(query) ||
      listing.category?.toLowerCase().includes(query) ||
      listing.seller?.toLowerCase().includes(query)
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  createServiceListing,
  getAllServiceListings,
  purchaseService,
  cancelServiceListing,
  getUserPurchases,
  getUserListings,
  filterListingsByCategory,
  searchListings,
};
