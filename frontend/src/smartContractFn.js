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
