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

// ============================================================================
// WALRUS FUNCTIONS
// ============================================================================

/**
 * Upload data to Walrus
 */
export async function uploadToWalrus(data, epochs = 100) {
  const blob =
    data instanceof Blob
      ? data
      : new Blob([JSON.stringify(data)], { type: "application/json" });

  const response = await fetch(
    `${CONFIG.WALRUS_PUBLISHER}/v1/store?epochs=${epochs}`,
    { method: "PUT", body: blob }
  );

  if (!response.ok) {
    throw new Error(`Walrus upload failed: ${response.statusText}`);
  }

  const result = await response.json();
  return (
    result.newlyCreated?.blobObject?.blobId || result.alreadyCertified?.blobId
  );
}

/**
 * Fetch data from Walrus
 */
export async function fetchFromWalrus(blobId) {
  const response = await fetch(`${CONFIG.WALRUS_AGGREGATOR}/v1/${blobId}`);

  if (!response.ok) {
    throw new Error(`Walrus fetch failed: ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return await response.json();
  }
  return await response.blob();
}

/**
 * Get image URL from Walrus blob ID
 */
export function getWalrusImageURL(blobId) {
  return `${CONFIG.WALRUS_AGGREGATOR}/v1/${blobId}`;
}

/**
 * Compress image before upload
 */
export async function compressImage(file, maxWidth = 800) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.8);
      };

      img.onerror = reject;
      img.src = e.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// USER PROFILE FUNCTIONS
// ============================================================================

/**
 * Create user profile
 * @param {Object} profileData - { username, skills, bio }
 * @param {File} imageFile - Profile image file
 * @param {Function} signAndExecute - From useSignAndExecuteTransaction hook
 */
export async function createProfile(profileData, imageFile, signAndExecute) {
  // 1. Compress and upload image
  const compressedImage = await compressImage(imageFile);
  const avatarBlobId = await uploadToWalrus(compressedImage);

  // 2. Create metadata
  const metadata = {
    username: profileData.username,
    bio: profileData.bio || "",
    skills: profileData.skills || [],
    avatar_blob_id: avatarBlobId,
    created_at: Date.now(),
  };

  // 3. Upload metadata
  const metadataBlobId = await uploadToWalrus(metadata);

  // 4. Create transaction
  const { Transaction } = await import("@mysten/sui/transactions");
  const tx = new Transaction();

  tx.moveCall({
    target: `${CONFIG.PACKAGE_ID}::user_profile::create_profile`,
    arguments: [tx.pure.string(metadataBlobId)],
  });

  // 5. Execute
  return new Promise((resolve, reject) => {
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => resolve(result),
        onError: (error) => reject(error),
      }
    );
  });
}

/**
 * Fetch user profile from blockchain
 * @param {Object} suiClient - Sui client instance
 * @param {string} walletAddress - User's wallet address
 */
export async function getUserProfile(suiClient, walletAddress) {
  // Get all objects owned by user
  const objects = await suiClient.getOwnedObjects({
    owner: walletAddress,
    filter: {
      StructType: `${CONFIG.PACKAGE_ID}::user_profile::UserProfile`,
    },
    options: { showContent: true },
  });

  if (objects.data.length === 0) {
    return null; // No profile found
  }

  // Get the profile object
  const profileObject = objects.data[0];
  const walrusBlobId = profileObject.data.content.fields.walrus_blob_id;

  // Fetch metadata from Walrus
  const metadata = await fetchFromWalrus(walrusBlobId);

  // Add avatar URL
  if (metadata.avatar_blob_id) {
    metadata.avatar_url = getWalrusImageURL(metadata.avatar_blob_id);
  }

  return {
    ...metadata,
    profileObjectId: profileObject.data.objectId,
  };
}

// ============================================================================
// SERVICE LISTING FUNCTIONS
// ============================================================================

/**
 * Create service listing
 * @param {Object} listingData - { title, description, category, price }
 * @param {File[]} images - Service images (optional)
 * @param {Function} signAndExecute - From useSignAndExecuteTransaction hook
 */
export async function createServiceListing(
  listingData,
  images,
  signAndExecute
) {
  // 1. Upload images
  const imageBlobIds = [];
  for (const image of images) {
    const compressed = await compressImage(image);
    const blobId = await uploadToWalrus(compressed);
    imageBlobIds.push(blobId);
  }

  // 2. Create metadata
  const metadata = {
    title: listingData.title,
    description: listingData.description,
    category: listingData.category || "Other",
    image_blob_ids: imageBlobIds,
    created_at: Date.now(),
  };

  // 3. Upload metadata
  const metadataBlobId = await uploadToWalrus(metadata);

  // 4. Create transaction (price in MIST: 1 SUI = 1,000,000,000 MIST)
  const { Transaction } = await import("@mysten/sui/transactions");
  const tx = new Transaction();

  const priceInMist = Math.floor(listingData.price * 1_000_000_000);

  tx.moveCall({
    target: `${CONFIG.PACKAGE_ID}::listings::create_listing`,
    arguments: [tx.pure.string(metadataBlobId), tx.pure.u64(priceInMist)],
  });

  // 5. Execute
  return new Promise((resolve, reject) => {
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => resolve(result),
        onError: (error) => reject(error),
      }
    );
  });
}

/**
 * Get all active service listings
 * @param {Object} suiClient - Sui client instance
 */
export async function getAllServiceListings(suiClient) {
  // Query all shared ServiceListing objects
  const response = await suiClient.getDynamicFields({
    parentId: CONFIG.PACKAGE_ID,
  });



  console.warn("Note: Full listing query requires event indexing or backend");
  return [];
}

/**
 * Purchase a service
 * @param {string} listingObjectId - Listing object ID
 * @param {number} price - Price in SUI
 * @param {Function} signAndExecute - From useSignAndExecuteTransaction hook
 */
export async function purchaseService(listingObjectId, price, signAndExecute) {
  const { Transaction } = await import("@mysten/sui/transactions");
  const tx = new Transaction();

  // Split coin for payment
  const priceInMist = Math.floor(price * 1_000_000_000);
  const [coin] = tx.splitCoins(tx.gas, [priceInMist]);

  // Call purchase function
  tx.moveCall({
    target: `${CONFIG.PACKAGE_ID}::listings::purchase_service`,
    arguments: [tx.object(listingObjectId), coin],
  });

  return new Promise((resolve, reject) => {
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => resolve(result),
        onError: (error) => reject(error),
      }
    );
  });
}

// ============================================================================
// NFT FUNCTIONS
// ============================================================================

/**
 * Mint NFT
 * @param {Object} nftData - { name, description, attributes }
 * @param {File} imageFile - NFT image
 * @param {Function} signAndExecute - From useSignAndExecuteTransaction hook
 */
export async function mintNFT(nftData, imageFile, signAndExecute) {
  // 1. Upload image (higher quality for NFTs)
  const compressedImage = await compressImage(imageFile, 1200);
  const imageBlobId = await uploadToWalrus(compressedImage);

  // 2. Create metadata
  const metadata = {
    name: nftData.name,
    description: nftData.description || "",
    image: getWalrusImageURL(imageBlobId),
    image_blob_id: imageBlobId,
    attributes: nftData.attributes || [],
    created_at: Date.now(),
  };

  // 3. Upload metadata
  const metadataBlobId = await uploadToWalrus(metadata);

  // 4. Create transaction
  const { Transaction } = await import("@mysten/sui/transactions");
  const tx = new Transaction();

  tx.moveCall({
    target: `${CONFIG.PACKAGE_ID}::nft::mint_nft`,
    arguments: [tx.pure.string(nftData.name), tx.pure.string(metadataBlobId)],
  });

  return new Promise((resolve, reject) => {
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => resolve(result),
        onError: (error) => reject(error),
      }
    );
  });
}

/**
 * Get user's NFTs
 * @param {Object} suiClient - Sui client instance
 * @param {string} walletAddress - User's wallet address
 */
export async function getUserNFTs(suiClient, walletAddress) {
  const objects = await suiClient.getOwnedObjects({
    owner: walletAddress,
    filter: {
      StructType: `${CONFIG.PACKAGE_ID}::nft::MarketplaceNFT`,
    },
    options: { showContent: true },
  });

  // Fetch metadata for each NFT
  const nfts = await Promise.all(
    objects.data.map(async (obj) => {
      const walrusBlobId = obj.data.content.fields.walrus_blob_id;
      const metadata = await fetchFromWalrus(walrusBlobId);

      return {
        ...metadata,
        nftObjectId: obj.data.objectId,
        name: obj.data.content.fields.name,
      };
    })
  );

  return nfts;
}

// ============================================================================
// GOVERNANCE FUNCTIONS
// ============================================================================

/**
 * Create proposal
 * @param {Object} proposalData - { title, description, votingDuration }
 * @param {Function} signAndExecute - From useSignAndExecuteTransaction hook
 */
export async function createProposal(proposalData, signAndExecute) {
  // 1. Create metadata
  const metadata = {
    title: proposalData.title,
    description: proposalData.description,
    created_at: Date.now(),
  };

  // 2. Upload metadata
  const metadataBlobId = await uploadToWalrus(metadata);

  // 3. Create transaction
  const { Transaction } = await import("@mysten/sui/transactions");
  const tx = new Transaction();

  tx.moveCall({
    target: `${CONFIG.PACKAGE_ID}::governance::create_proposal`,
    arguments: [
      tx.pure.string(proposalData.title),
      tx.pure.string(metadataBlobId),
      tx.pure.u64(proposalData.votingDuration || 7), // Default 7 epochs
    ],
  });

  return new Promise((resolve, reject) => {
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => resolve(result),
        onError: (error) => reject(error),
      }
    );
  });
}

/**
 * Vote on proposal
 * @param {string} proposalObjectId - Proposal object ID
 * @param {boolean} voteFor - true = yes, false = no
 * @param {Function} signAndExecute - From useSignAndExecuteTransaction hook
 */
export async function voteOnProposal(
  proposalObjectId,
  voteFor,
  signAndExecute
) {
  const { Transaction } = await import("@mysten/sui/transactions");
  const tx = new Transaction();

  tx.moveCall({
    target: `${CONFIG.PACKAGE_ID}::governance::vote`,
    arguments: [tx.object(proposalObjectId), tx.pure.bool(voteFor)],
  });

  return new Promise((resolve, reject) => {
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => resolve(result),
        onError: (error) => reject(error),
      }
    );
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
