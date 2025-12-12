import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NFTSIMgs from '../../assets/morenft.jpg'
import nft3 from '../../assets/nft3.jpg'
import nft4 from '../../assets/nft4.jpg'
import { Search, Bell, Camera,Upload,UploadCloudIcon,UploadIcon, Plus, X, UploadCloud, Award, Heart, ThumbsDown, CalendarCheck, Share2 } from 'lucide-react'
import useStore from '../../store/useStore'

export default function Portfolio() {
  const [username, setUsername] = useState('Ndiukwu chukwuemeka paul ')
  const [email, setEmail] = useState('youremail@example.com')
  const [bio, setBio] = useState('Tell the community about yourself...')
  const [skills, setSkills] = useState(['React', 'Rust'])
  const [skillInput, setSkillInput] = useState('')
  const [socials, setSocials] = useState([])
  const [socialTitle, setSocialTitle] = useState('')
  const [socialUrl, setSocialUrl] = useState('')
  const [avatarPreview, setAvatarPreview] = useState(nft3)
  const [offerType, setOfferType] = useState('hire')
  const [offerPrice, setOfferPrice] = useState('10')
  const navigate = useNavigate()
  const store = useStore()
  const [uploadLoading, setUploadLoading] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [featuredWorks, setFeaturedWorks] = useState([])

  useEffect(() => {
    // initialise from global store
    try {
      const user = store.user
      if (user) {
        if (user.username) setUsername(user.username)
        if (user.bio) setBio(user.bio)
        if (user.skills && user.skills.length) setSkills(user.skills)
        if (user.avatar) setAvatarPreview(user.avatar)
        if (user.offerType) setOfferType(user.offerType)
        if (user.offerPrice) setOfferPrice(user.offerPrice)
        if (user.featuredWorks && user.featuredWorks.length) setFeaturedWorks(user.featuredWorks)
      }
      // Check if profile is published in marketplace
      const profileExists = store.getProfileById(user?.id)
      setIsPublished(!!profileExists)
    } catch (e) {
      // ignore
    }
  }, [store.user?.id])

  const addSkill = () => {
    const value = skillInput.trim()
    if (!value) return
    if (skills.length >= 10) return
    setSkills((s) => [...s, value])
    setSkillInput('')
  }

  const removeSkill = (idx) => setSkills((s) => s.filter((_, i) => i !== idx))

  const addSocial = () => {
    const title = socialTitle.trim()
    const url = socialUrl.trim()
    if (!title || !url) return
    setSocials((s) => [...s, { title, url }])
    setSocialTitle('')
    setSocialUrl('')
  }

  const removeSocial = (idx) => setSocials((s) => s.filter((_, i) => i !== idx))

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    // persist to store
    const id = store.user?.id || `user_${Date.now()}`
    store.setUser({ ...store.user, id, username, bio, avatar: avatarPreview, skills, offerType, offerPrice })
    // update marketplace profile if exists (save only)
    store.updateProfile(id, { username, bio, avatar: avatarPreview, skills, offerType, offerPrice })
    alert('Profile saved locally. Use Upload to publish to Marketplace.')
  }

  const handleUpload = () => {
    // Upload to marketplace (creates/updates profile entry and navigates)
    setUploadLoading(true)
    const id = store.user?.id || `user_${Date.now()}`
    const profile = {
      id,
      username,
      avatar: avatarPreview || null,
      cardImage: avatarPreview || null,
      skills,
      bio,
      price: offerPrice || 0,
      likes: 0,
      createdAt: new Date().toISOString(),
    }
    store.setUser({ ...store.user, id, username, bio, avatar: avatarPreview, skills, offerType, offerPrice, showTour: false })
    store.addProfile(profile)
    setIsPublished(true)
    alert('✓ Successfully uploaded to Marketplace!')
    setTimeout(() => {
      setUploadLoading(false)
      navigate('/dashboard/marketplace')
    }, 500)
  }

  const handleTakeDown = () => {
    // Remove profile from marketplace
    const confirmed = window.confirm('Are you sure you want to take down your profile? It will no longer be visible on the Marketplace.')
    if (!confirmed) return
    
    const id = store.user?.id
    if (id) {
      store.removeProfile(id)
      setIsPublished(false)
      alert('✓ Your profile has been taken down from the Marketplace.')
    }
  }

  // simple tour state: show when new user flag present (read from store on mount)
  const [showTour, setShowTour] = useState(() => {
    try {
      return !!store.user?.showTour
    } catch {
      return false
    }
  })
  
  useEffect(() => {
    // Listen for changes to showTour flag
    if (store.user?.showTour) {
      setShowTour(true)
    }
  }, [store.user?.showTour])

  const closeTour = () => {
    setShowTour(false)
    if (store.user) store.setUser({ ...store.user, showTour: false })
  }

  

  const renderTopbar = () => (
    <div className="bg-white border-b select-none border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8 flex-1">
        <h2 className="text-blue-500 text-xl font-semibold">Portfolio</h2>
        <div className="flex-1 max-w-md">
          {/* <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search your works..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div> */}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleSave} className="px-4 py-2 flex items-center gap-2 bg-slate-500 text-white rounded-md font-medium">
       <UploadCloud className='size-4'/> Save Changes 
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full lg:pb-0 pb-20">
      {renderTopbar()}
      <div className="flex-1 overflow-auto py-2 px-4 ">
        <div className="flex items-center justify-end mb-4">
          {/* <h1 className="text-3xl font-bold text-slate-900">Profile</h1> */}
          <div className="text-sm text-slate-500 flex justify-end">Last updated: just now</div>
        </div>

        {/* Public profile card - full width */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col items-center text-center gap-4">
            {/* Buttons at top - smaller */}
            <div className="flex items-center gap-2 w-full justify-center">
              <button className="px-2 py-1 bg-slate-100 rounded-md text-xs flex items-center gap-1"><Share2 className='size-3'/> Share</button>
              <button onClick={()=>navigate('/dashboard/edit')} className="px-2 py-1 bg-blue-500 text-white rounded-md text-xs">Edit</button>
            </div>

            {/* Centered profile image */}
            <div className="flex items-center justify-center">
              <div className="w-40 h-40 bg-slate-100 rounded-full flex items-center justify-center text-2xl font-bold text-slate-700 overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{username?.split(' ').map(n=>n[0]).slice(0,2).join('')}</span>
                )}
              </div>
            </div>

            {/* Name and info centered */}
            <div className="w-full">
              <h2 className="text-2xl font-bold text-slate-900">{username}</h2>
              <p className="text-sm text-slate-600 mt-3">{bio}</p>

              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {skills.map((s, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-100 rounded-full text-sm">{s}</span>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-4 justify-center">
                <div>
                  <p className="text-xs text-slate-500">Offering</p>
                  <p className="text-lg font-semibold text-slate-900">{offerType === 'hire' ? 'Available for hire' : offerType === 'internship' ? 'Open to internship' : 'Mentoring'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Rate</p>
                  <p className="text-lg font-bold text-blue-600">${offerPrice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

       
        
        {/* Featured work + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-6  shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Featured Work</h3>
                <button onClick={()=>navigate('/dashboard/edit')} className="text-xs px-2 py-1 text-blue-500 hover:bg-blue-50 rounded">+ Add More</button>
              </div>
              
              {featuredWorks && featuredWorks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuredWorks.map((work, i) => (
                    <div key={work.id || i} className="rounded-lg overflow-hidden border border-black/20 bg-white">
                      {work.image ? (
                        <img src={work.image} alt={work.title} className="w-full h-40 object-cover" />
                      ) : (
                        <div className="w-full h-40 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">No image</div>
                      )}
                      <div className="p-3">
                        <p className="font-semibold">{work.title}</p>
                        <p className="text-xs text-slate-500">Skills: {work.skills}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[NFTSIMgs, nft3].map((imgSrc, i) => (
                    <div key={i} className="rounded-lg overflow-hidden border border-black/20 bg-white">
                      <img src={imgSrc} alt={`Featured ${i+1}`} className="w-full h-40 object-cover" />
                      <div className="p-3">
                        <p className="font-semibold">No featured project</p>
                        <p className="text-xs text-slate-500">Add works in Edit page</p>
                        <p className="text-sm mt-2 text-slate-600">Showcase your best projects to clients.</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleUpload} className="mt-4 w-full px-4 py-2 flex items-center justify-center gap-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 disabled:bg-slate-400" disabled={uploadLoading}>
              <UploadCloud className='size-4'/> {uploadLoading ? 'Uploading...' : 'Upload to Marketplace'}
            </button>
            {isPublished && (
              <button onClick={handleTakeDown} className="mt-2 w-full px-4 py-2 flex items-center justify-center gap-2 bg-red-500 text-white rounded-md font-medium hover:bg-red-600">
                <X className='size-4'/> Take Down Profile
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6  shadow-sm">
              <h3 className="font-semibold mb-4">Stats & Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-md bg-blue-200"><Award className="text-blue-600" /></div>
                  <div>
                    <div className="font-medium">Likes</div>
                    <div className="text-sm text-slate-500">123 likes</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-md bg-blue-200"><ThumbsDown className="text-blue-600" /></div>
                  <div>
                    <div className="font-medium">Dislikes</div>
                    <div className="text-sm text-slate-500">5 dislikes</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-md bg-blue-200"><CalendarCheck className="text-blue-600" /></div>
                  <div>
                    <div className="font-medium">Years</div>
                    <div className="text-sm text-slate-500">3 years</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6  shadow-sm">
              <h3 className="font-semibold mb-2">Digital Assets</h3>
              <p className="text-sm text-slate-500 mb-4">NFTs</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 text-sm text-slate-500">No NFTs found</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTour && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg max-w-md">
            <h3 className="text-2xl font-semibold mb-4">Welcome to your Portfolio! 🎉</h3>
            <p className="text-sm text-slate-600 mb-6">Your profile is ready. You can:</p>
            <ul className="text-sm text-slate-600 space-y-2 mb-6">
              <li>✓ Save changes locally anytime</li>
              <li>✓ Edit your profile details</li>
              <li>✓ Upload to Marketplace when ready</li>
            </ul>
            <p className="text-xs text-slate-500 mb-6">Once uploaded, your profile will be visible to clients looking for talent like you.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={closeTour} className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50">Skip for now</button>
              <button onClick={() => { closeTour() }} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Got it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
