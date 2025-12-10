import React, { useState } from 'react'
import { Home, ShoppingBag, MessageSquare, Briefcase, Settings, Menu, X, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function Dashboardlayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const sidebarItems = [
    // { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, path: '/dashboard/marketplace' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/dashboard/messages' },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase, path: '/dashboard/portfolio' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex h-screen bg-slate-50 ">
      {/* Desktop Sidebar (visible md+) */}
      <motion.div
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="hidden md:flex bg-white text-black transition-all duration-300 flex-col border-r border-black/10   fixed h-screen left-0 top-0 z-50"
      >
        {/* Logo */}
        <div className=" p-6  flex items-center justify-between ">
          {isSidebarOpen && (
            <Link to="/" className="flex items-center border-b border-black/30 pb-2  ">
          <div className="w-10 h-8 rounded-lg bg-blue-400 flex items-center justify-center text-white text-sui-300 font-bold">SUI</div>
          <div>Exchange</div>
        </Link>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-slate-800/20 rounded-lg"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-3">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-blue-400/20 border border-blue-500 text-blue-500'
                  : 'text-black hover:bg-blue-300'
              }`}
              title={!isSidebarOpen ? item.label : ''}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-800/20">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-slate-500 hover:bg-blue-500 transition-all">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Mobile Bottom Bar (icons-only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black/10 z-50 h-16 flex items-center justify-around px-4">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center gap-0 p-2 rounded-md transition-colors ${isActive(item.path) ? 'text-blue-500' : 'text-slate-600'}`}
            aria-label={item.label}
          >
            <item.icon size={20} />
            {/* visually hide labels on mobile but keep for screen readers */}
            <span className="sr-only">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content with Outlet */}
      <div className={`flex-1 transition-all duration-300  ${isSidebarOpen ? 'md:ml-70' : 'md:ml-20'}`}> 
        {/* On mobile leave full-width (bottom bar overlays) */}
        <Outlet />
      </div>
    </div>
  )
}
