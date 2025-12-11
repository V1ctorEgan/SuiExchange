// ============================================================================
// PUSH PROTOCOL CHAT INTEGRATION
// File: utils/pushChat.js
// ============================================================================

import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";

let pushUser = null;
let messageStream = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize Push Protocol with user's wallet
 * Call this once when user connects wallet
 * @param {Object} suiSigner - Sui wallet signer
 * @returns {Promise<PushAPI>} Initialized Push user
 */
export async function initializePush(suiSigner) {
  try {
    if (pushUser) {
      console.log("Push already initialized");
      return pushUser;
    }

    // Convert Sui signer to Ethereum-compatible format
    // Push Protocol uses Ethereum-style signatures
    const ethSigner = await convertSuiToEthSigner(suiSigner);

    // Initialize Push
    pushUser = await PushAPI.initialize(ethSigner, {
      env: "staging", // Use 'prod' for production
    });

    console.log("✅ Push Protocol initialized");
    return pushUser;
  } catch (error) {
    console.error("❌ Push initialization failed:", error);
    throw new Error("Failed to initialize Push Protocol: " + error.message);
  }
}

/**
 * Convert Sui signer to Ethereum-compatible format for Push
 * @param {Object} suiSigner - Sui wallet signer
 * @returns {Promise<ethers.Wallet>} Ethereum wallet
 */
async function convertSuiToEthSigner(suiSigner) {
  // For development: Create a deterministic Ethereum wallet from Sui address
  // In production, you might want to use a more secure method

  // Get Sui address
  const suiAddress = await suiSigner.getAddress();

  // Create deterministic private key (for demo purposes)
  // In production, consider using a proper key derivation method
  const privateKey = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(suiAddress)
  );

  // Create Ethereum wallet
  return new ethers.Wallet(privateKey);
}

/**
 * Check if Push is initialized
 */
export function isPushInitialized() {
  return pushUser !== null;
}

/**
 * Get current Push user
 */
export function getPushUser() {
  return pushUser;
}

// ============================================================================
// CHAT FUNCTIONS
// ============================================================================

/**
 * Send a message to another wallet address
 * @param {string} recipientAddress - Recipient's wallet address
 * @param {string} messageText - Message content
 * @returns {Promise<Object>} Sent message object
 */
export async function sendMessage(recipientAddress, messageText) {
  if (!pushUser) {
    throw new Error("Push not initialized. Call initializePush() first.");
  }

  try {
    const response = await pushUser.chat.send(recipientAddress, {
      type: "Text",
      content: messageText,
    });

    console.log("✅ Message sent:", response);
    return response;
  } catch (error) {
    console.error("❌ Failed to send message:", error);
    throw new Error("Failed to send message: " + error.message);
  }
}

/**
 * Get chat history with a specific user
 * @param {string} recipientAddress - Other user's wallet address
 * @param {number} limit - Number of messages to fetch (default: 50)
 * @returns {Promise<Array>} Array of message objects
 */
export async function getChatHistory(recipientAddress, limit = 50) {
  if (!pushUser) {
    throw new Error("Push not initialized. Call initializePush() first.");
  }

  try {
    const history = await pushUser.chat.history(recipientAddress, {
      limit,
    });

    // Transform to your UI format
    return history.map((msg) => ({
      sender: msg.fromDID === pushUser.did ? "You" : "Them",
      senderAddress: msg.fromDID,
      message: msg.messageContent || msg.messageObj?.content,
      time: formatMessageTime(msg.timestamp),
      timestamp: msg.timestamp,
      id: msg.cid,
    }));
  } catch (error) {
    console.error("❌ Failed to get chat history:", error);
    return [];
  }
}

/**
 * Get list of all conversations
 * @returns {Promise<Array>} Array of conversation objects
 */
export async function getConversationList() {
  if (!pushUser) {
    throw new Error("Push not initialized. Call initializePush() first.");
  }

  try {
    const chats = await pushUser.chat.list("CHATS");

    // Transform to your UI format
    return chats.map((chat) => ({
      id: chat.did,
      name: chat.profilePicture || chat.did.slice(0, 10) + "...",
      walletAddress: chat.did,
      message: chat.msg?.messageContent || "Start chatting",
      timeJoined: formatMessageTime(chat.msg?.timestamp),
      unread: chat.unreadCount || 0,
      timestamp: chat.msg?.timestamp || Date.now(),
    }));
  } catch (error) {
    console.error("❌ Failed to get conversation list:", error);
    return [];
  }
}

/**
 * Search for a user by wallet address
 * @param {string} walletAddress - Wallet address to search
 * @returns {Promise<Object|null>} User profile or null
 */
export async function searchUser(walletAddress) {
  if (!pushUser) {
    throw new Error("Push not initialized. Call initializePush() first.");
  }

  try {
    // In Push, you can directly message any wallet address
    // No need to search, just start a conversation
    return {
      id: walletAddress,
      name: walletAddress.slice(0, 10) + "...",
      walletAddress,
    };
  } catch (error) {
    console.error("❌ Failed to search user:", error);
    return null;
  }
}

// ============================================================================
// REAL-TIME MESSAGE LISTENING
// ============================================================================

/**
 * Start listening for new messages in real-time
 * @param {Function} onMessage - Callback function called when new message arrives
 * @returns {Promise<void>}
 */
export async function startMessageListener(onMessage) {
  if (!pushUser) {
    throw new Error("Push not initialized. Call initializePush() first.");
  }

  try {
    // Stop existing stream if any
    if (messageStream) {
      await messageStream.disconnect();
    }

    // Initialize new stream
    messageStream = await pushUser.initStream([CONSTANTS.STREAM.CHAT]);

    // Listen for chat messages
    messageStream.on(CONSTANTS.STREAM.CHAT, (data) => {
      console.log("📨 New message received:", data);

      // Transform message to your format
      const transformedMessage = {
        sender: data.from === pushUser.account ? "You" : "Them",
        senderAddress: data.from,
        message: data.message?.content || data.message,
        time: formatMessageTime(Date.now()),
        timestamp: Date.now(),
        id: data.cid || Date.now().toString(),
      };

      // Call the callback
      onMessage(transformedMessage);
    });

    // Connect the stream
    await messageStream.connect();
    console.log("✅ Message listener started");
  } catch (error) {
    console.error("❌ Failed to start message listener:", error);
    throw new Error("Failed to start message listener: " + error.message);
  }
}

/**
 * Stop listening for new messages
 * @returns {Promise<void>}
 */
export async function stopMessageListener() {
  if (messageStream) {
    try {
      await messageStream.disconnect();
      messageStream = null;
      console.log("✅ Message listener stopped");
    } catch (error) {
      console.error("❌ Failed to stop message listener:", error);
    }
  }
}

// ============================================================================
// GROUP CHAT FUNCTIONS (Optional - for future use)
// ============================================================================

/**
 * Create a group chat
 * @param {string} groupName - Name of the group
 * @param {Array<string>} members - Array of wallet addresses
 * @returns {Promise<Object>} Created group object
 */
export async function createGroupChat(groupName, members) {
  if (!pushUser) {
    throw new Error("Push not initialized. Call initializePush() first.");
  }

  try {
    const group = await pushUser.chat.group.create(groupName, {
      description: "Project collaboration group",
      members,
      admins: [],
      private: false,
    });

    console.log("✅ Group created:", group);
    return group;
  } catch (error) {
    console.error("❌ Failed to create group:", error);
    throw new Error("Failed to create group: " + error.message);
  }
}

/**
 * Send message to a group
 * @param {string} groupChatId - Group chat ID
 * @param {string} messageText - Message content
 * @returns {Promise<Object>} Sent message
 */
export async function sendGroupMessage(groupChatId, messageText) {
  if (!pushUser) {
    throw new Error("Push not initialized. Call initializePush() first.");
  }

  try {
    const response = await pushUser.chat.send(groupChatId, {
      type: "Text",
      content: messageText,
    });

    return response;
  } catch (error) {
    console.error("❌ Failed to send group message:", error);
    throw new Error("Failed to send group message: " + error.message);
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format timestamp to readable time
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted time string
 */
function formatMessageTime(timestamp) {
  if (!timestamp) return "Now";

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format wallet address for display
 * @param {string} address - Full wallet address
 * @returns {string} Shortened address
 */
export function formatAddress(address) {
  if (!address) return "";
  if (address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Get user's Push DID (Decentralized ID)
 * @returns {string|null} User's DID
 */
export function getUserDID() {
  return pushUser?.did || null;
}

/**
 * Check if user has Push profile
 * @param {string} walletAddress - Wallet address to check
 * @returns {Promise<boolean>} True if user has Push profile
 */
export async function hasUserProfile(walletAddress) {
  try {
    const user = await PushAPI.user.get({
      account: walletAddress,
      env: "staging",
    });
    return !!user;
  } catch (error) {
    return false;
  }
}

// ============================================================================
// NOTIFICATION FUNCTIONS (Bonus)
// ============================================================================

/**
 * Send a notification to a user
 * @param {string} recipientAddress - Recipient's wallet address
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @returns {Promise<Object>} Sent notification
 */
export async function sendNotification(recipientAddress, title, body) {
  if (!pushUser) {
    throw new Error("Push not initialized. Call initializePush() first.");
  }

  try {
    // Note: This requires channel creation which is a separate process
    // For now, we'll use chat messages as notifications
    await sendMessage(recipientAddress, `📢 ${title}: ${body}`);
    console.log("✅ Notification sent via chat");
  } catch (error) {
    console.error("❌ Failed to send notification:", error);
  }
}

// ============================================================================
// ERROR HANDLING & CLEANUP
// ============================================================================

/**
 * Cleanup and disconnect Push
 * Call this when user disconnects wallet
 */
export async function disconnectPush() {
  try {
    if (messageStream) {
      await stopMessageListener();
    }
    pushUser = null;
    console.log("✅ Push disconnected");
  } catch (error) {
    console.error("❌ Failed to disconnect Push:", error);
  }
}

/**
 * Handle Push errors gracefully
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export function handlePushError(error) {
  console.error("Push Error:", error);

  if (error.message.includes("not initialized")) {
    return "Please connect your wallet first";
  }
  if (error.message.includes("rate limit")) {
    return "Too many requests. Please wait a moment";
  }
  if (error.message.includes("network")) {
    return "Network error. Please check your connection";
  }

  return "Something went wrong. Please try again";
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Initialization
  initializePush,
  isPushInitialized,
  getPushUser,
  disconnectPush,

  // Chat
  sendMessage,
  getChatHistory,
  getConversationList,
  searchUser,

  // Real-time
  startMessageListener,
  stopMessageListener,

  // Groups (optional)
  createGroupChat,
  sendGroupMessage,

  // Utilities
  formatAddress,
  getUserDID,
  hasUserProfile,
  sendNotification,
  handlePushError,
};
