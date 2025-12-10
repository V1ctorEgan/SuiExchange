import React, { useState } from 'react'
import { Search, Bell, MessageSquare, ChevronLeft } from 'lucide-react'

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(null)

  const chatList = [
    { id: 1, name: 'Alice Johnson', message: 'Hey, interested in your design services', timeJoined: '10:00 AM', unread: 2 },
    { id: 2, name: 'Bob Smith', message: 'NFT offer accepted! 🎉', timeJoined: '2:30 PM', unread: 0 },
    { id: 3, name: 'Carol Davis', message: 'Can we collaborate on this project?', timeJoined: '9:15 AM', unread: 1 },
    { id: 4, name: 'David Wilson', message: 'Thanks for the amazing work!', timeJoined: '3:45 PM', unread: 0 },
    { id: 5, name: 'Eve Martinez', message: 'Portfolio looks great!', timeJoined: '11:20 AM', unread: 3 },
  ]

  const mockChatHistory = {
    1: [
      { sender: 'Alice', message: 'Hey, interested in your design services', time: '10:30 AM' },
      { sender: 'You', message: 'Hi Alice! Yes, I can help. What do you need?', time: '10:32 AM' },
      { sender: 'Alice', message: 'I need a website redesign', time: '10:33 AM' },
    ],
    2: [
      { sender: 'Bob', message: 'Your NFT collection is amazing!', time: '2:45 PM' },
      { sender: 'You', message: 'Thank you! Would you like to make an offer?', time: '2:46 PM' },
      { sender: 'Bob', message: 'NFT offer accepted! 🎉', time: '2:50 PM' },
    ],
    3: [
      { sender: 'Carol', message: 'Can we collaborate on this project?', time: 'Yesterday' },
    ],
  }

  return (
    <div className="flex h-full lg:bg-black/20 flex-col md:flex-row">
      {/* Chat List - Always visible on lg, hidden on mobile when chat selected */}
      <div className={`bg-white  border-r lg:mx-3 lg:my-3 rounded-lg lg:py-2 border-slate-200 flex flex-col ${selectedChat ? 'hidden md:flex' : 'w-full md:w-80'} lg:w-80`}>

        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {chatList.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`w-full p-4 border-b border-slate-100 text-left hover:bg-slate-50 transition-colors ${
                selectedChat === chat.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Profile Avatar */}
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {chat.name[0]}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  {/* Header: Name, Time, Unread */}
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-slate-900 truncate">{chat.name}</p>
                    <span className="text-xs text-slate-500 ml-2">{chat.timeJoined}</span>
                  </div>

                  {/* Message Preview */}
                  <div className='flex items-center justify-between'>
                    <p className="text-sm text-slate-600 truncate mb-2">{chat.message}</p>

                    {/* Unread Badge */}
                    {chat.unread > 0 && (
                      <span className="inline-flex items-center justify-center bg-blue-500 text-white text-xs rounded-full w-5 h-5 ml-2">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat History - On lg view, both list and history visible side by side */}
      <div className={`flex-1 flex flex-col  bg-white ${selectedChat ? 'flex' : 'hidden md:flex'} lg:flex`}>
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
                  {chatList.find(c => c.id === selectedChat)?.name[0]}
                </div>
                <div>
                  <p className="font-semibold">{chatList.find(c => c.id === selectedChat)?.name}</p>
                  <p className="text-xs text-slate-500">Online</p>
                </div>
              </div>
              <Bell size={20} className="text-slate-600 cursor-pointer" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {mockChatHistory[selectedChat]?.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === 'You'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-200 text-slate-900'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'You' ? 'text-blue-100' : 'text-slate-600'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Send
                </button>
              </div>
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
