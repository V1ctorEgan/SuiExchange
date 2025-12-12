// ============================================================================
// SIMPLE CHAT SOLUTION - Using Walrus Storage
// File: src/utils/simpleChat.js
// ============================================================================

import { uploadToWalrus, fetchFromWalrus } from "../smartContractFn";
const CHAT_STORAGE_PREFIX = "chat_";
const CONVERSATIONS_KEY = "user_conversations_";

// ============================================================================
// CHAT FUNCTIONS
// ============================================================================

/**
 * Send a message to another user
 * @param {string} senderAddress - Your wallet address
 * @param {string} recipientAddress - Recipient's wallet address
 * @param {string} messageText - Message content
 * @returns {Promise<Object>} Message object
 */
export async function sendMessage(
  senderAddress,
  recipientAddress,
  messageText
) {
  try {
    console.log("Sending message from", senderAddress, "to", recipientAddress);

    // Create message object
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender: senderAddress,
      recipient: recipientAddress,
      message: messageText,
      timestamp: Date.now(),
      time: formatMessageTime(Date.now()),
    };

    // Get conversation ID (sorted to ensure same ID for both parties)
    const conversationId = getConversationId(senderAddress, recipientAddress);

    console.log("Conversation ID:", conversationId);

    // Load existing conversation
    const conversation = await loadConversation(conversationId);

    // Add new message
    conversation.messages.push(message);
    conversation.lastMessage = messageText;
    conversation.lastMessageTime = Date.now();

    console.log("Uploading conversation to Walrus...");

    // Upload to Walrus
    const blobId = await uploadToWalrus(conversation);

    console.log("Conversation uploaded, blob ID:", blobId);

    // Store conversation reference in localStorage
    saveConversationReference(
      senderAddress,
      conversationId,
      blobId,
      recipientAddress
    );
    saveConversationReference(
      recipientAddress,
      conversationId,
      blobId,
      senderAddress
    );

    console.log("✅ Message sent successfully");
    return message;
  } catch (error) {
    console.error("❌ Failed to send message:", error);
    throw new Error("Failed to send message: " + error.message);
  }
}

/**
 * Get chat history between two users
 * @param {string} userAddress - Your wallet address
 * @param {string} otherAddress - Other user's wallet address
 * @returns {Promise<Array>} Array of messages
 */
export async function getChatHistory(userAddress, otherAddress) {
  try {
    console.log(
      "Loading chat history between",
      userAddress,
      "and",
      otherAddress
    );

    const conversationId = getConversationId(userAddress, otherAddress);
    const conversation = await loadConversation(conversationId);

    console.log(
      "Chat history loaded:",
      conversation.messages.length,
      "messages"
    );

    // Transform messages to UI format
    return conversation.messages.map((msg) => ({
      sender: msg.sender === userAddress ? "You" : "Them",
      senderAddress: msg.sender,
      message: msg.message,
      time: msg.time,
      timestamp: msg.timestamp,
      id: msg.id,
    }));
  } catch (error) {
    console.error("❌ Failed to get chat history:", error);
    return [];
  }
}

/**
 * Get list of all conversations for a user
 * @param {string} userAddress - User's wallet address
 * @returns {Promise<Array>} Array of conversation objects
 */
export async function getConversationList(userAddress) {
  try {
    console.log("Loading conversation list for", userAddress);

    const conversationsKey = CONVERSATIONS_KEY + userAddress;
    const savedConversations = JSON.parse(
      localStorage.getItem(conversationsKey) || "{}"
    );

    console.log(
      "Found",
      Object.keys(savedConversations).length,
      "conversations in localStorage"
    );

    const conversations = [];

    for (const [conversationId, data] of Object.entries(savedConversations)) {
      try {
        const conversation = await loadConversation(
          conversationId,
          data.blobId
        );

        conversations.push({
          id: conversationId,
          name: formatAddress(data.otherAddress),
          walletAddress: data.otherAddress,
          message: conversation.lastMessage || "No messages yet",
          timeJoined: formatMessageTime(conversation.lastMessageTime),
          unread: 0, // You can implement unread logic later
          timestamp: conversation.lastMessageTime || Date.now(),
        });
      } catch (err) {
        console.error("Failed to load conversation:", conversationId, err);
      }
    }

    // Sort by most recent
    conversations.sort((a, b) => b.timestamp - a.timestamp);

    console.log("Loaded", conversations.length, "conversations");

    return conversations;
  } catch (error) {
    console.error("❌ Failed to get conversation list:", error);
    return [];
  }
}

/**
 * Start a new conversation
 * @param {string} userAddress - Your wallet address
 * @param {string} otherAddress - Other user's wallet address
 * @returns {Promise<Object>} Conversation object
 */
export async function startNewConversation(userAddress, otherAddress) {
  console.log(
    "Starting new conversation between",
    userAddress,
    "and",
    otherAddress
  );

  const conversationId = getConversationId(userAddress, otherAddress);

  // Create empty conversation
  const conversation = {
    id: conversationId,
    participants: [userAddress, otherAddress],
    messages: [],
    createdAt: Date.now(),
    lastMessage: "",
    lastMessageTime: Date.now(),
  };

  // Upload to Walrus
  const blobId = await uploadToWalrus(conversation);

  console.log("New conversation created, blob ID:", blobId);

  // Save reference
  saveConversationReference(userAddress, conversationId, blobId, otherAddress);

  return {
    id: conversationId,
    name: formatAddress(otherAddress),
    walletAddress: otherAddress,
    message: "Start chatting",
    timeJoined: "Now",
    unread: 0,
    timestamp: Date.now(),
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get conversation ID from two addresses (ensures consistency)
 */
function getConversationId(address1, address2) {
  const sorted = [address1, address2].sort();
  return `${CHAT_STORAGE_PREFIX}${sorted[0]}_${sorted[1]}`;
}

/**
 * Load conversation from Walrus or create new one
 */
async function loadConversation(conversationId, blobId = null) {
  try {
    // Try to get blobId from localStorage if not provided
    if (!blobId) {
      const allUsers = getAllUserAddresses();
      for (const userAddress of allUsers) {
        const conversationsKey = CONVERSATIONS_KEY + userAddress;
        const savedConversations = JSON.parse(
          localStorage.getItem(conversationsKey) || "{}"
        );
        if (savedConversations[conversationId]) {
          blobId = savedConversations[conversationId].blobId;
          break;
        }
      }
    }

    if (blobId) {
      console.log("Loading conversation from Walrus:", blobId);
      const conversation = await fetchFromWalrus(blobId);
      return conversation;
    }
  } catch (error) {
    console.log(
      "Could not load conversation, creating new:",
      conversationId,
      error
    );
  }

  // Return empty conversation if not found
  return {
    id: conversationId,
    participants: [],
    messages: [],
    createdAt: Date.now(),
    lastMessage: "",
    lastMessageTime: Date.now(),
  };
}

/**
 * Save conversation reference in localStorage
 */
function saveConversationReference(
  userAddress,
  conversationId,
  blobId,
  otherAddress
) {
  const conversationsKey = CONVERSATIONS_KEY + userAddress;
  const savedConversations = JSON.parse(
    localStorage.getItem(conversationsKey) || "{}"
  );

  savedConversations[conversationId] = {
    blobId,
    otherAddress,
    lastUpdated: Date.now(),
  };

  localStorage.setItem(conversationsKey, JSON.stringify(savedConversations));
  console.log("Saved conversation reference for", userAddress);
}

/**
 * Get all user addresses from localStorage (helper for loading conversations)
 */
function getAllUserAddresses() {
  const addresses = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CONVERSATIONS_KEY)) {
      addresses.push(key.replace(CONVERSATIONS_KEY, ""));
    }
  }
  return addresses;
}

/**
 * Format timestamp to readable time
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
 */
export function formatAddress(address) {
  if (!address) return "";
  if (address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Poll for new messages (simple polling mechanism)
 * In production, you'd use websockets or Push Protocol
 */
export async function pollForNewMessages(
  userAddress,
  conversationId,
  lastMessageTime,
  onNewMessage
) {
  try {
    const conversation = await loadConversation(conversationId);

    // Check if there are new messages
    const newMessages = conversation.messages.filter(
      (msg) => msg.timestamp > lastMessageTime && msg.sender !== userAddress
    );

    if (newMessages.length > 0) {
      console.log("Found", newMessages.length, "new messages");
      newMessages.forEach((msg) => {
        onNewMessage({
          sender: "Them",
          senderAddress: msg.sender,
          message: msg.message,
          time: msg.time,
          timestamp: msg.timestamp,
          id: msg.id,
        });
      });
    }

    return conversation.lastMessageTime || lastMessageTime;
  } catch (error) {
    console.error("Polling error:", error);
    return lastMessageTime;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  sendMessage,
  getChatHistory,
  getConversationList,
  startNewConversation,
  pollForNewMessages,
  formatAddress,
};
