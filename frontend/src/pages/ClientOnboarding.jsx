import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import useStore from '../store/useStore'

export default function ClientOnboarding() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleContinue = async (e) => {
    e.preventDefault()
    if (!username.trim()) {
      alert('Please enter a username')
      return
    }

    setLoading(true)
    try {
      // Save to global store (persisted via zustand)
      const id = `user_${Date.now()}`
      useStore.getState().setUser({ id, username, avatar: null, skills: [], role: 'client', bio: '' })
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard/marketplace')
      }, 500)
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/onboarding/role')}
          className="flex items-center gap-2 text-slate-300 hover:text-blue-400 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-blue-100 p-3 rounded-full mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                C
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome, Client!</h1>
            <p className="text-slate-600">Set up your profile to get started</p>
          </div>

          <form onSubmit={handleContinue} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose your username"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <p className="text-xs text-slate-500 mt-1">This will be your display name on the platform</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
            >
              {loading ? 'Setting up...' : 'Continue to Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-500">
              As a client, you can browse and hire top Web3 talent
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
