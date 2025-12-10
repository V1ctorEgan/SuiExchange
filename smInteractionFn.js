// ============================================================================
// SUI MARKETPLACE SDK - Contract Interaction Functions (JavaScript)
// ============================================================================

import { TransactionBlock } from "@mysten/sui.js/transactions";

// ============================================================================
// CONFIGURATION
// ============================================================================

export const PACKAGE_ID =
  "0xddda65f9f32984409cb14bb6ae3beda6c8d7d8b13a5300f388edac19c729b909";

export const MODULES = {
  GOVERNANCE: `${PACKAGE_ID}::governance`,
  LISTINGS: `${PACKAGE_ID}::listings`,
  NFT: `${PACKAGE_ID}::nft`,
  USER_PROFILE: `${PACKAGE_ID}::user_profile`,
};

// ============================================================================
// USER PROFILE FUNCTIONS
// ============================================================================

/**
 * Create a new user profile
 * @param {string} walrusBlobId - Walrus blob ID containing profile data
 * @returns {TransactionBlock}
 */
export function createProfile(walrusBlobId) {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${MODULES.USER_PROFILE}::create_profile`,
    arguments: [tx.pure.string(walrusBlobId)],
  });

  return tx;
}

/**
 * Update an existing user profile
 * @param {string} profileId - Profile object ID
 * @param {string} newWalrusBlobId - New Walrus blob ID
 * @returns {TransactionBlock}
 */
export function updateProfile(profileId, newWalrusBlobId) {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${MODULES.USER_PROFILE}::update_profile`,
    arguments: [tx.object(profileId), tx.pure.string(newWalrusBlobId)],
  });

  return tx;
}

/**
 * Fetch user profile from blockchain
 * @param {SuiClient} client - Sui client instance
 * @param {string} profileId - Profile object ID
 * @returns {Promise<Object|null>}
 */
export async function getUserProfile(client, profileId) {
  try {
    const object = await client.getObject({
      id: profileId,
      options: { showContent: true },
    });

    if (object.data?.content?.dataType === "moveObject") {
      const fields = object.data.content.fields;
      return {
        id: profileId,
        owner: fields.owner,
        walrus_blob_id: fields.walrus_blob_id,
        created_at: fields.created_at,
        updated_at: fields.updated_at,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

// ============================================================================
// SERVICE LISTINGS FUNCTIONS
// ============================================================================

/**
 * Create a new service listing
 * @param {string} walrusBlobId - Service details on Walrus
 * @param {string} priceInMist - Price in MIST
 * @returns {TransactionBlock}
 */
export function createListing(walrusBlobId, priceInMist) {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${MODULES.LISTINGS}::create_listing`,
    arguments: [tx.pure.string(walrusBlobId), tx.pure.u64(priceInMist)],
  });

  return tx;
}

/**
 * Purchase a service
 * @param {string} listingId - Listing object ID
 * @param {string} paymentCoinId - Payment coin object ID
 * @returns {TransactionBlock}
 */
export function purchaseService(listingId, paymentCoinId) {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${MODULES.LISTINGS}::purchase_service`,
    arguments: [tx.object(listingId), tx.object(paymentCoinId)],
  });

  return tx;
}

/**
 * Purchase service with split coins
 * @param {string} listingId - Listing object ID
 * @param {string} priceInMist - Price in MIST
 * @param {string[]} coinIds - Array of user's coin object IDs
 * @returns {TransactionBlock}
 */
export function purchaseServiceWithSplit(listingId, priceInMist, coinIds) {
  const tx = new TransactionBlock();

  // Merge all coins
  const [primaryCoin, ...restCoins] = coinIds.map((id) => tx.object(id));
  if (restCoins.length > 0) {
    tx.mergeCoins(primaryCoin, restCoins);
  }

  // Split exact amount needed
  const [paymentCoin] = tx.splitCoins(primaryCoin, [tx.pure.u64(priceInMist)]);

  tx.moveCall({
    target: `${MODULES.LISTINGS}::purchase_service`,
    arguments: [tx.object(listingId), paymentCoin],
  });

  return tx;
}

/**
 * Cancel a listing
 * @param {string} listingId - Listing object ID
 * @returns {TransactionBlock}
 */
export function cancelListing(listingId) {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${MODULES.LISTINGS}::cancel_listing`,
    arguments: [tx.object(listingId)],
  });

  return tx;
}

/**
 * Fetch service listing details
 * @param {SuiClient} client - Sui client instance
 * @param {string} listingId - Listing object ID
 * @returns {Promise<Object|null>}
 */
export async function getServiceListing(client, listingId) {
  try {
    const object = await client.getObject({
      id: listingId,
      options: { showContent: true },
    });

    if (object.data?.content?.dataType === "moveObject") {
      const fields = object.data.content.fields;
      return {
        id: listingId,
        seller: fields.seller,
        walrus_blob_id: fields.walrus_blob_id,
        price: fields.price,
        active: fields.active,
        created_at: fields.created_at,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
}

/**
 * Fetch all active service listings
 * @param {SuiClient} client - Sui client instance
 * @returns {Promise<Array>}
 */
export async function getAllActiveListings(client) {
  try {
    const objects = await client.queryEvents({
      query: {
        MoveEventType: `${MODULES.LISTINGS}::ListingCreated`,
      },
    });

    const listings = [];

    for (const event of objects.data) {
      const listingId = event.parsedJson.listing_id;
      const listing = await getServiceListing(client, listingId);
      if (listing && listing.active) {
        listings.push(listing);
      }
    }

    return listings;
  } catch (error) {
    console.error("Error fetching active listings:", error);
    return [];
  }
}

// ============================================================================
// NFT FUNCTIONS
// ============================================================================

/**
 * Mint a new NFT
 * @param {string} name - NFT name
 * @param {string} walrusBlobId - NFT metadata on Walrus
 * @returns {TransactionBlock}
 */
export function mintNFT(name, walrusBlobId) {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${MODULES.NFT}::mint_nft`,
    arguments: [tx.pure.string(name), tx.pure.string(walrusBlobId)],
  });

  return tx;
}

/**
 * List NFT for sale
 * @param {string} nftId - NFT object ID
 * @param {string} priceInMist - Price in MIST
 * @returns {TransactionBlock}
 */
export function listNFT(nftId, priceInMist) {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${MODULES.NFT}::list_nft`,
    arguments: [tx.object(nftId), tx.pure.u64(priceInMist)],
  });

  return tx;
}

/**
 * Buy NFT from listing
 * @param {string} listingId - NFT listing object ID
 * @param {string} nftId - NFT object ID
 * @param {string} paymentCoinId - Payment coin object ID
 * @returns {TransactionBlock}
 */
export function buyNFT(listingId, nftId, paymentCoinId) {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${MODULES.NFT}::buy_nft`,
    arguments: [
      tx.object(listingId),
      tx.object(nftId),
      tx.object(paymentCoinId),
    ],
  });

  return tx;
}

/**
 * Buy NFT with coin split
 * @param {string} listingId - NFT listing object ID
 * @param {string} nftId - NFT object ID
 * @param {string} priceInMist - Price in MIST
 * @param {string[]} coinIds - Array of user's coin object IDs
 * @returns {TransactionBlock}
 */
export function buyNFTWithSplit(listingId, nftId, priceInMist, coinIds) {
  const tx = new TransactionBlock();

  // Merge and split coins
  const [primaryCoin, ...restCoins] = coinIds.map((id) => tx.object(id));
  if (restCoins.length > 0) {
    tx.mergeCoins(primaryCoin, restCoins);
  }
  const [paymentCoin] = tx.splitCoins(primaryCoin, [tx.pure.u64(priceInMist)]);

  tx.moveCall({
    target: `${MODULES.NFT}::buy_nft`,
    arguments: [tx.object(listingId), tx.object(nftId), paymentCoin],
  });

  return tx;
}

/**
 * Cancel NFT listing
 * @param {string} listingId - NFT listing object ID
 * @param {string} nftId - NFT object ID
 * @returns {TransactionBlock}
 */
export function cancelNFTListing(listingId, nftId) {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${MODULES.NFT}::cancel_nft_listing`,
    arguments: [tx.object(listingId), tx.object(nftId)],
  });

  return tx;
}

/**
 * Fetch NFT details
 * @param {SuiClient} client - Sui client instance
 * @param {string} nftId - NFT object ID
 * @returns {Promise<Object|null>}
 */
export async function getNFT(client, nftId) {
  try {
    const object = await client.getObject({
      id: nftId,
      options: { showContent: true },
    });

    if (object.data?.content?.dataType === "moveObject") {
      const fields = object.data.content.fields;
      return {
        id: nftId,
        name: fields.name,
        walrus_blob_id: fields.walrus_blob_id,
        creator: fields.creator,
        minted_at: fields.minted_at,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching NFT:", error);
    return null;
  }
}

// ============================================================================
// GOVERNANCE FUNCTIONS
// ============================================================================

/**
 * Create a governance proposal
 * @param {string} title - Proposal title
 * @param {string} walrusBlobId - Full proposal details on Walrus
 * @param {number} votingDurationEpochs - How long voting lasts
 * @returns {TransactionBlock}
 */
export function createProposal(title, walrusBlobId, votingDurationEpochs) {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${MODULES.GOVERNANCE}::create_proposal`,
    arguments: [
      tx.pure.string(title),
      tx.pure.string(walrusBlobId),
      tx.pure.u64(votingDurationEpochs),
    ],
  });

  return tx;
}

/**
 * Vote on a proposal
 * @param {string} proposalId - Proposal object ID
 * @param {boolean} voteFor - true = vote for, false = vote against
 * @returns {TransactionBlock}
 */
export function vote(proposalId, voteFor) {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${MODULES.GOVERNANCE}::vote`,
    arguments: [tx.object(proposalId), tx.pure.bool(voteFor)],
  });

  return tx;
}

/**
 * Execute/finalize a proposal
 * @param {string} proposalId - Proposal object ID
 * @returns {TransactionBlock}
 */
export function executeProposal(proposalId) {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${MODULES.GOVERNANCE}::execute_proposal`,
    arguments: [tx.object(proposalId)],
  });

  return tx;
}

/**
 * Fetch proposal details
 * @param {SuiClient} client - Sui client instance
 * @param {string} proposalId - Proposal object ID
 * @returns {Promise<Object|null>}
 */
export async function getProposal(client, proposalId) {
  try {
    const object = await client.getObject({
      id: proposalId,
      options: { showContent: true },
    });

    if (object.data?.content?.dataType === "moveObject") {
      const fields = object.data.content.fields;
      return {
        id: proposalId,
        title: fields.title,
        walrus_blob_id: fields.walrus_blob_id,
        proposer: fields.proposer,
        votes_for: fields.votes_for,
        votes_against: fields.votes_against,
        active: fields.active,
        created_at: fields.created_at,
        voting_ends_at: fields.voting_ends_at,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return null;
  }
}

/**
 * Fetch all proposals
 * @param {SuiClient} client - Sui client instance
 * @returns {Promise<Array>}
 */
export async function getAllProposals(client) {
  try {
    const events = await client.queryEvents({
      query: {
        MoveEventType: `${MODULES.GOVERNANCE}::ProposalCreated`,
      },
    });

    const proposals = [];

    for (const event of events.data) {
      const proposalId = event.parsedJson.proposal_id;
      const proposal = await getProposal(client, proposalId);
      if (proposal) {
        proposals.push(proposal);
      }
    }

    return proposals;
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return [];
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
 * @param {number} sui - Amount in SUI
 * @returns {string}
 */
export function suiToMist(sui) {
  return (sui * 1_000_000_000).toString();
}

/**
 * Convert MIST to SUI
 * @param {string} mist - Amount in MIST
 * @returns {number}
 */
export function mistToSui(mist) {
  return parseInt(mist) / 1_000_000_000;
}

/**
 * Get user's SUI coins
 * @param {SuiClient} client - Sui client instance
 * @param {string} address - User's wallet address
 * @returns {Promise<string[]>}
 */
export async function getUserCoins(client, address) {
  try {
    const coins = await client.getCoins({
      owner: address,
      coinType: "0x2::sui::SUI",
    });
    return coins.data.map((coin) => coin.coinObjectId);
  } catch (error) {
    console.error("Error fetching coins:", error);
    return [];
  }
}

/**
 * Get user's total SUI balance
 * @param {SuiClient} client - Sui client instance
 * @param {string} address - User's wallet address
 * @returns {Promise<number>}
 */
export async function getUserBalance(client, address) {
  try {
    const balance = await client.getBalance({
      owner: address,
      coinType: "0x2::sui::SUI",
    });
    return mistToSui(balance.totalBalance);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return 0;
  }
}
