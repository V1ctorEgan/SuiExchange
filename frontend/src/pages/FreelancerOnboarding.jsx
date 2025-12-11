import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Plus, X, Wallet, AlertCircle } from 'lucide-react'
import { useWallet } from '@suiet/wallet-kit'
import { CONFIG, uploadToWalrus, compressImage, testWalrusConnection } from '../smartContractFn'

export default function FreelancerOnboarding() {
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [stack, setStack] = useState([])
  const [stackInput, setStackInput] = useState('')
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [walrusStatus, setWalrusStatus] = useState(null)
  const navigate = useNavigate()
  
  const wallet = useWallet()

  useEffect(() => {
    if (!wallet.connected) {
      console.warn('Wallet not connected')
    }
  }, [wallet.connected])

  // Test Walrus connection on mount
  useEffect(() => {
    const checkWalrus = async () => {
      const result = await testWalrusConnection()
      setWalrusStatus(result)
    }
    checkWalrus()
  }, [])

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
    if (!file) return
    
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB')
      return
    }
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file')
      return
    }
    
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
    setAvatarFile(file)
  }

  const handleContinue = async (e) => {
    e.preventDefault()
    
    if (!wallet.connected) {
      alert('Please connect your wallet first')
      wallet.select('Sui Wallet')
      return
    }
    
    if (!username.trim()) {
      alert('Please enter a username')
      return
    }
    
    if (stack.length === 0) {
      alert('Please add at least one skill to your stack')
      return
    }
    
    if (!avatarFile) {
      alert('Please upload a profile image')
      return
    }

    setLoading(true)
    setUploadProgress('Starting...')
    
    try {
      // Dynamically import Transaction to avoid build issues
      const { Transaction } = await import('@mysten/sui/transactions')
      
      // 1. Compress and upload image to Walrus
      setUploadProgress('Compressing image...')
      console.log('Compressing image...')
      const compressedImage = await compressImage(avatarFile)
      
      setUploadProgress('Uploading image to Walrus (this may take 30-60 seconds)...')
      console.log('Uploading image to Walrus...')
      
      let avatarBlobId
      try {
        avatarBlobId = await uploadToWalrus(compressedImage, 100) // 100 epochs
        console.log('Avatar uploaded:', avatarBlobId)
      } catch (error) {
        console.error('Avatar upload error:', error)
        throw new Error(`Failed to upload image to Walrus: ${error.message}. Walrus may be temporarily unavailable.`)
      }

      // 2. Create metadata
      setUploadProgress('Creating metadata...')
      const metadata = {
        username: username.trim(),
        bio: bio.trim() || `${username} - Freelancer`,
        skills: stack,
        avatar_blob_id: avatarBlobId,
        created_at: Date.now(),
      }

      // 3. Upload metadata to Walrus
      setUploadProgress('Uploading metadata to Walrus...')
      console.log('Uploading metadata to Walrus...')
      
      let metadataBlobId
      try {
        metadataBlobId = await uploadToWalrus(metadata, 100)
        console.log('Metadata uploaded:', metadataBlobId)
      } catch (error) {
        console.error('Metadata upload error:', error)
        throw new Error(`Failed to upload metadata to Walrus: ${error.message}`)
      }

      // 4. Create transaction
      setUploadProgress('Creating blockchain transaction...')
      const tx = new Transaction()
      
      tx.moveCall({
        target: `${CONFIG.PACKAGE_ID}::user_profile::create_profile`,
        arguments: [tx.pure.string(metadataBlobId)],
      })

      // 5. Sign and execute with Suiet wallet
      setUploadProgress('Waiting for wallet signature...')
      console.log('Executing transaction...')
      const result = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
        }
      })

      console.log('Profile created successfully:', result)

      // Check if transaction was successful
      if (result.effects?.status?.status !== 'success') {
        throw new Error('Transaction failed on blockchain')
      }

      // Save to localStorage as backup
      localStorage.setItem('user_username', username)
      localStorage.setItem('user_role', 'freelancer')
      localStorage.setItem('user_stack', JSON.stringify(stack))
      if (avatarPreview) {
        localStorage.setItem('user_avatar', avatarPreview)
      }

      setUploadProgress('Success! Redirecting...')
      alert('Profile created successfully!')

      setTimeout(() => {
        navigate('/dashboard/portfolio')
      }, 500)
      
    } catch (error) {
      console.error('Error creating profile:', error)
      
      if (error.message?.includes('User rejected')) {
        alert('Transaction was rejected. Please try again.')
      } else if (error.message?.includes('Insufficient')) {
        alert('Insufficient funds. Please ensure you have enough SUI for gas fees.')
      } else if (error.message?.includes('Walrus')) {
        alert(`Walrus Storage Error: ${error.message}\n\nWalrus testnet may be temporarily down. Please try again in a few minutes.`)
      } else if (error.message?.includes('Cannot find module')) {
        alert('Missing required package. Please run: npm install @mysten/sui')
      } else {
        alert(`Failed to create profile: ${error.message || 'Please try again.'}`)
      }
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

          {/* Walrus Status Indicator */}
          {walrusStatus && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              walrusStatus.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <AlertCircle 
                className={`mt-0.5 shrink-0 ${
                  walrusStatus.success ? 'text-green-600' : 'text-red-600'
                }`} 
                size={20} 
              />
              <div>
                <p className={`text-sm font-semibold ${
                  walrusStatus.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {walrusStatus.success ? 'Walrus Connected' : 'Walrus Connection Issue'}
                </p>
                <p className={`text-xs mt-1 ${
                  walrusStatus.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {walrusStatus.success 
                    ? 'Storage network is operational' 
                    : `${walrusStatus.error}. You may experience upload failures.`
                  }
                </p>
              </div>
            </div>
          )}

          {/* Wallet Connection Warning */}
          {!wallet.connected && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
              <Wallet className="text-yellow-600 mt-0.5 shrink-0" size={20} />
              <div>
                <p className="text-sm font-semibold text-yellow-800">Wallet Not Connected</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Please connect your Sui wallet to create your profile on the blockchain.
                </p>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {loading && uploadProgress && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-800">{uploadProgress}</p>
              <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse w-full"></div>
              </div>
            </div>
          )}

          <form onSubmit={handleContinue} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose your username"
                disabled={loading}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Bio (Optional)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                disabled={loading}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-slate-100 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tech Stack & Skills *
              </label>
              <div className="flex flex-wrap gap-2 mb-3 min-h-8">
                {stack.map((s, idx) => (
                  <span key={idx} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full text-sm text-blue-700">
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => removeFromStack(idx)}
                      disabled={loading}
                      className="p-0.5 rounded-full hover:bg-blue-200 disabled:opacity-50"
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
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToStack())}
                  placeholder="e.g., React, Rust, Node.js"
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-slate-100"
                />
                <button
                  type="button"
                  onClick={addToStack}
                  disabled={loading || stack.length >= 10}
                  className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg inline-flex items-center gap-2 transition-colors disabled:bg-slate-400"
                >
                  <Plus size={18} />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Add up to 10 skills (press Enter or click +) {stack.length > 0 && `- ${stack.length}/10 added`}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Profile Image *
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="flex flex-col items-center justify-center">
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
                        className="w-32 h-32 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarPreview(null)
                          setAvatarFile(null)
                        }}
                        disabled={loading}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 disabled:opacity-50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                This image will be stored on Walrus decentralized storage
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !wallet.connected || !username.trim() || stack.length === 0 || !avatarFile}
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