import React, { useState } from 'react'
import { Camera, X, Save, LogOut } from 'lucide-react'
import nft3 from '../../assets/nft3.jpg'
import useStore from '../../store/useStore'

export default function Settings() {
  const [username, setUsername] = useState('your_username')
  const [bio, setBio] = useState('Passionate about Web3 and decentralized technologies.')
  const [showOnline, setShowOnline] = useState(false)
  const [allowMessages, setAllowMessages] = useState(true)
  const [newMessages, setNewMessages] = useState(true)
  const [walletActivity, setWalletActivity] = useState(true)
  const [marketUpdates, setMarketUpdates] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(nft3)

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    // persist settings and user profile to global store
    useStore.getState().setSettings({ showOnline, allowMessages, newMessages, walletActivity, marketUpdates })
    useStore.getState().setUser({ username, bio, avatar: avatarPreview })
    alert('Settings saved!')
  }

  const handleLogout = () => {
    // Clear global store (user + profiles)
    useStore.getState().clearUser()
    // Optionally clear profiles/services if desired (not doing here)
    window.location.href = '/'
  }

  const ToggleButton = ({ active, onChange }) => (
    <button
      onClick={() => onChange(!active)}
      className={`relative w-12 h-7 rounded-full transition-colors ${
        active ? 'bg-blue-500' : 'bg-slate-300'
      }`}
    >
      <div
        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
          active ? 'translate-x-6' : 'translate-x-0.5'
        }`}
      />
    </button>
  )

  return (
    <div className="flex-1 overflow-auto px-7 pb-20 pt-5 bg-slate-50 ">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
     
        <div className="lg:col-span-1 space-y-6">
  
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="mb-4">
              <h3 className="font-semibold text-slate-900">Profile</h3>
              <p className="text-xs text-slate-500">This information will be displayed publicly</p>
            </div>

      
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-lg font-bold text-slate-700">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span>{username?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <label className="absolute -right-1 -bottom-1 bg-blue-500 p-2 rounded-full cursor-pointer">
                  <Camera size={14} className="text-white" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>

              <div className="flex gap-2 w-full">
                <button className="flex-1 px-3 py-1 border border-slate-300 rounded-md text-sm hover:bg-slate-50">
                  Change
                </button>
                <button className="flex-1 px-3 py-1 border border-slate-300 rounded-md text-sm hover:bg-slate-50">
                  Remove
                </button>
              </div>
            </div>

         
            <div className="mb-4">
              <label className="text-sm text-slate-600 block mb-2">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-blue-400"
              />
            </div>

    
            <div>
              <label className="text-sm text-slate-600 block mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Privacy Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900">Privacy</h3>
              <p className="text-xs text-slate-500">Control who can see your activity</p>
            </div>

            {/* Show Online Status */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-slate-900">Show online status</p>
                <p className="text-xs text-slate-500">Let others see when you are online</p>
              </div>
              <ToggleButton active={showOnline} onChange={setShowOnline} />
            </div>

            {/* Allow Direct Messages */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-slate-900">Allow direct messages</p>
                <p className="text-xs text-slate-500">Receive messages from anyone</p>
              </div>
              <ToggleButton active={allowMessages} onChange={setAllowMessages} />
            </div>
          </div>
        </div>

        {/* Right Column: Notifications */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900">Notifications</h3>
              <p className="text-xs text-slate-500">Choose how you get notified</p>
            </div>

            <div className="space-y-4">
              {/* New Messages */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <p className="font-medium text-sm text-slate-900">New messages</p>
                </div>
                <ToggleButton active={newMessages} onChange={setNewMessages} />
              </div>

              {/* Wallet Activity */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <p className="font-medium text-sm text-slate-900">Wallet activity</p>
                </div>
                <ToggleButton active={walletActivity} onChange={setWalletActivity} />
              </div>

              {/* Market Updates */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-slate-900">Market updates</p>
                </div>
                <ToggleButton active={marketUpdates} onChange={setMarketUpdates} />
              </div>
            </div>
          </div>

          {/* Save Changes Button */}
          <div className="mt-6">
            <button
              onClick={handleSave}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
            >
              <Save size={18} />
              Save changes
            </button>
          </div>

          {/* Logout Button - Mobile View */}
          <div className="mt-4 md:hidden">
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-red-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
