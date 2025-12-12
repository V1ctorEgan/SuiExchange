import React, { useState, useEffect, useRef } from 'react'
import { Search, Bell, MessageSquare, ChevronLeft, Loader2, AlertCircle } from 'lucide-react'
import { useWallet } from '@suiet/wallet-kit'


export default function Messages() {
  const wallet = useWallet()
  
  // State
  const [selectedChat, setSelectedChat] = useState(null)
  const [chatList, setChatList] = useState([])
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [newChatAddress, setNewChatAddress] = useState('')
  
  // Loading & Error states
  const [loading, setLoading] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [error, setError] = useState(null)
  
  // Refs
  const messagesEndRef = useRef(null)

  // Mock data for testing
  const mockChatList = [
    { id: 1, name: 'Alice Johnson', walletAddress: '0x1234...5678', message: 'Hey, interested in your design services', timeJoined: '10:00 AM', unread: 2 },
    { id: 2, name: 'Bob Smith', walletAddress: '0xabcd...ef90', message: 'NFT offer accepted! 🎉', timeJoined: '2:30 PM', unread: 0 },
    { id: 3, name: 'Carol Davis', walletAddress: '0x9876...5432', message: 'Can we collaborate on this project?', timeJoined: '9:15 AM', unread: 1 },
  ]

  const mockChatHistory = {
    1: [
      { sender: 'Alice', message: 'Hey, interested in your design services', time: '10:30 AM', id: '1' },
      { sender: 'You', message: 'Hi Alice! Yes, I can help. What do you need?', time: '10:32 AM', id: '2' },
      { sender: 'Alice', message: 'I need a website redesign', time: '10:33 AM', id: '3' },
    ],
    2: [
      { sender: 'Bob', message: 'Your NFT collection is amazing!', time: '2:45 PM', id: '4' },
      { sender: 'You', message: 'Thank you! Would you like to make an offer?', time: '2:46 PM', id: '5' },
      { sender: 'Bob', message: 'NFT offer accepted! 🎉', time: '2:50 PM', id: '6' },
    ],
  }

  // Initialize with mock data
  useEffect(() => {
    setChatList(mockChatList)
  }, [])

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load chat history when a conversation is selected
  const loadChatHistory = (chat) => {
    setSelectedChat(chat)
    setLoadingMessages(true)
    
    setTimeout(() => {
      setMessages(mockChatHistory[chat.id] || [])
      setLoadingMessages(false)
    }, 500)
  }

  // Send message
  const handleSendMessage = (e) => {
    e?.preventDefault()
    
    if (!messageInput.trim() || !selectedChat) return
    
    setSendingMessage(true)
    
    setTimeout(() => {
      const newMessage = {
        sender: 'You',
        message: messageInput.trim(),
        time: 'Now',
        id: Date.now().toString()
      }
      
      setMessages(prev => [...prev, newMessage])
      setMessageInput('')
      setSendingMessage(false)
    }, 300)
  }

  // Start new chat
  const handleStartNewChat = () => {
    if (!newChatAddress.trim()) {
      setError('Please enter a valid wallet address')
      return
    }
    
    const newChat = {
      id: Date.now(),
      name: newChatAddress.slice(0, 10) + '...',
      walletAddress: newChatAddress,
      message: 'Start chatting',
      timeJoined: 'Now',
      unread: 0
    }
    
    setChatList(prev => [newChat, ...prev])
    setSelectedChat(newChat)
    setMessages([])
    setNewChatAddress('')
  }

  // Filter chat list based on search
  const filteredChatList = chatList.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // If wallet not connected
  if (!wallet.connected) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <MessageSquare size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Connect Your Wallet</h3>
          <p className="text-slate-500 mb-4">Please connect your wallet to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full lg:bg-black/20 flex-col md:flex-row">
      {/* Error Banner */}
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-3 flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-white hover:text-red-100">
            ✕
          </button>
        </div>
      )}

      {/* Chat List */}
      <div className={`bg-white border-r lg:mx-3 lg:my-3 rounded-lg lg:py-2 border-slate-200 flex flex-col ${selectedChat ? 'hidden md:flex' : 'w-full md:w-80'} lg:w-80`}>
        
        {/* Search & New Chat */}
        <div className="p-4 border-b border-slate-200 space-y-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          {/* New Chat Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Start new chat (wallet address)..."
              value={newChatAddress}
              onChange={(e) => setNewChatAddress(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleStartNewChat}
              className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 whitespace-nowrap"
            >
              Start
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-auto">
          {filteredChatList.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <MessageSquare size={32} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-1">Start a new chat above</p>
            </div>
          ) : (
            filteredChatList.map((chat) => (
              <button
                key={chat.id}
                onClick={() => loadChatHistory(chat)}
                className={`w-full p-4 border-b border-slate-100 text-left hover:bg-slate-50 transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Profile Avatar */}
                  <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {chat.name[0].toUpperCase()}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-slate-900 truncate">{chat.name}</p>
                      <span className="text-xs text-slate-500 ml-2">{chat.timeJoined}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-600 truncate">{chat.message}</p>
                      {chat.unread > 0 && (
                        <span className="inline-flex items-center justify-center bg-blue-500 text-white text-xs rounded-full w-5 h-5 ml-2">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col border lg:pb-0 pb-15 bg-white ${selectedChat ? 'flex' : 'hidden md:flex'} lg:flex`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden lg:hidden"
                >
                  <ChevronLeft size={24} className="text-slate-600" />
                </button>
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedChat.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{selectedChat.name}</p>
                  <p className="text-xs text-slate-500">{selectedChat.walletAddress}</p>
                </div>
              </div>
              <Bell size={20} className="text-slate-600 cursor-pointer" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 size={32} className="text-blue-500 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <div className="text-center">
                    <MessageSquare size={48} className="mx-auto mb-2 text-slate-300" />
                    <p>No messages yet</p>
                    <p className="text-sm mt-1">Start the conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={msg.id || idx} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === 'You'
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-200 text-slate-900'
                      }`}
                    >
                      <p className="text-sm wrap-break-words">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'You' ? 'text-blue-100' : 'text-slate-600'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-200">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  disabled={sendingMessage}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-slate-100"
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !messageInput.trim()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-400 flex items-center gap-2"
                >
                  {sendingMessage ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending
                    </>
                  ) : (
                    'Send'
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageSquare size={48} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}