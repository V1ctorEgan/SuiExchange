import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Plus, X } from 'lucide-react'
import useStore from '../store/useStore'
import { useWallet } from '@suiet/wallet-kit'

export default function FreelancerOnboarding() {
  const [username, setUsername] = useState('')
  const [stack, setStack] = useState([])
  const [stackInput, setStackInput] = useState('')
  const [bio, setBio] = useState('')
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [walrusStatus, setWalrusStatus] = useState(null)
  const navigate = useNavigate()
  const store = useStore()
  const wallet = useWallet() 

  const addToStack = () => {
    const value = stackInput.trim()
    if (!value) return
    if (stack.length >= 10) return
    setStack((s) => [...s, value])
    setStackInput('')
  }

  const removeFromStack = (idx) => {
    setStack((s) => s.filter((_, i) => i !== idx))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    setAvatarFile(file)
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result)
    reader.readAsDataURL(file)
  }

  // ----- CONTINUE BUTTON ACTION -----
  const handleContinue = async (e) => {
    e.preventDefault()
    if (!username.trim()) {
      alert('Please enter a username')
      return
    }
    if (stack.length === 0) {
      alert('Please add at least one skill to your stack')
      return
    }

    setLoading(true)
    try {
      // Save to global store (persisted via zustand)
      const id = `user_${Date.now()}`
      store.setUser({ 
        id, 
        username, 
        avatar: avatarPreview || null, 
        skills: stack, 
        role: 'freelancer', 
        bio: bio || '', 
        showTour: true 
      })
      // Also add a public profile entry for marketplace (saved but not promoted unless uploaded)
      store.addProfile({ 
        id, 
        username, 
        avatar: avatarPreview || null, 
        skills: stack, 
        bio: bio || '', 
        price: 0, 
        likes: 0, 
        createdAt: new Date().toISOString() 
      })

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard/portfolio')
      }, 500)
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong: ' + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
      setUploadProgress('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-2xl">
        <button
          onClick={() => navigate('/onboarding/role')}
          className="flex items-center gap-2 text-slate-500 hover:text-black mb-8 transition-colors"
          disabled={loading}
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-2xl border border-black/20 px-2 py-4 lg:py-0 lg:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome, Freelancer!</h1>
            <p className="text-slate-600">Complete your profile to showcase your skills</p>
          </div>

          <form onSubmit={handleContinue} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose your username"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            {/* Stack / Skills */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tech Stack & Skills *
              </label>
              <div className="flex flex-wrap gap-2 mb-3 min-h-8">
                {stack.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full text-sm text-blue-700"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeFromStack(idx)}
                      className="p-0.5 rounded-full hover:bg-blue-200"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={stackInput}
                  onChange={(e) => setStackInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToStack())}
                  placeholder="e.g., React, Rust, Node.js"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <button
                  type="button"
                  onClick={addToStack}
                  className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">Add up to 10 skills (press Enter or click +)</p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Short Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell the community about yourself"
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <p className="text-xs text-slate-500 mt-1">A short summary that appears on your profile (optional)</p>
            </div>

            {/* Image Upload - Now Optional */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Profile Image (Optional)
              </label>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <Upload size={32} className="text-slate-400 mb-2" />
                      <p className="text-sm font-medium text-slate-700">Click to upload image</p>
                      <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>

                {avatarPreview && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="relative">
                      <img
                        src={avatarPreview}
                        alt="preview"
                        className="w-32 h-32 rounded-lg object-cover shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarPreview(null)
                          setAvatarFile(null)
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {avatarPreview 
                  ? 'This image will be your profile avatar' 
                  : 'Skip for now - you can add a profile picture later'}
              </p>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading || !username.trim() || stack.length === 0}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
            >
              {loading ? uploadProgress || 'Processing...' : !wallet.connected ? 'Connect Wallet First' : 'Continue to Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-500">
              Profile stored on Sui blockchain • Images on Walrus storage
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}