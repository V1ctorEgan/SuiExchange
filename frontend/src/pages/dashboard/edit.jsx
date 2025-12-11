import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Camera, Plus, X, UploadCloud, Trash2 } from 'lucide-react'
import useStore from '../../store/useStore'

export default function Edit() {
  const [username, setUsername] = useState('Your Name')
  const [email, setEmail] = useState('youremail@example.com')
  const [bio, setBio] = useState('Tell the community about yourself...')
  const [skills, setSkills] = useState(['React', 'Rust'])
  const [skillInput, setSkillInput] = useState('')
  const [socials, setSocials] = useState([])
  const [socialTitle, setSocialTitle] = useState('')
  const [socialUrl, setSocialUrl] = useState('')
  const [avatarPreview, setAvatarPreview] = useState(null)
  const navigate = useNavigate()
  const store = useStore()
  const [offerType, setOfferType] = useState('hire')
  const [offerPrice, setOfferPrice] = useState('')
  const [featuredWorks, setFeaturedWorks] = useState([])
  const [workTitle, setWorkTitle] = useState('')
  const [workSkills, setWorkSkills] = useState([])
  const [workSkillInput, setWorkSkillInput] = useState('')
  const [workImage, setWorkImage] = useState(null)

  useEffect(() => {
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
    } catch (e) {
      // ignore
    }
  }, [store.user])

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

  const handleWorkImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setWorkImage(reader.result)
    reader.readAsDataURL(file)
  }

  const addFeaturedWork = () => {
    if (!workTitle.trim()) {
      alert('Please enter a work title')
      return
    }
    if (!workSkills.trim()) {
      alert('Please enter skills/frameworks used')
      return
    }
    if (!workImage) {
      alert('Please upload an image')
      return
    }
    
    const newWork = {
      id: `work_${Date.now()}`,
      title: workTitle,
      skills: workSkills,
      image: workImage,
    }
    
    setFeaturedWorks([...featuredWorks, newWork])
    setWorkTitle('')
    setWorkSkills('')
    setWorkImage(null)
  }

  const removeFeaturedWork = (idx) => {
    setFeaturedWorks(featuredWorks.filter((_, i) => i !== idx))
  }

  const handleSave = () => {
    console.log({ username, email, bio, skills, socials, offerType, offerPrice, featuredWorks })
    try {
      const id = store.user?.id || `user_${Date.now()}`
      // save to global store
      store.setUser({ ...store.user, id, username, bio, avatar: avatarPreview, skills, featuredWorks })
      store.updateProfile(id, { username, bio, avatar: avatarPreview, offerType, offerPrice, skills, featuredWorks })
      // After saving edits, go to Portfolio so the user can choose to upload to marketplace
      navigate('/dashboard/portfolio')
    } catch (e) {
      console.warn('store unavailable', e)
    }
  }

  const renderTopbar = () => (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8 flex-1">
        <h2 className="text-blue-500 font-semibold">Edit Profile</h2>
        {/* <div className="flex-1 max-w-md">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search your works..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div> */}
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium">
          Save changes
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      {renderTopbar()}
      <div className="flex-1 overflow-auto p-4 mb-15 lg:mb-0 ">
        <div className="flex items-center justify-between mb-4">
          {/* <h1 className="text-3xl font-bold text-slate-900">Edit Profile</h1> */}
          <div className="text-sm text-slate-500">Last updated: just now</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center relative">
              <h3 className="font-semibold mb-4">Profile</h3>

              <div className="relative inline-block">
                <div className="w-40 h-40 bg-slate-100 rounded-full flex items-center justify-center text-2xl font-bold text-slate-700 overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{username?.split(' ').map(n=>n[0]).slice(0,2).join('')}</span>
                  )}
                </div>

                <label className="absolute -right-2 -bottom-2 bg-blue-500 p-2 rounded-full cursor-pointer shadow">
                  <Camera size={16} className="text-white" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>

              <p className="text-sm text-slate-500 mt-3">Upload a new avatar</p>
              <div className="mt-4 text-left">
                <label className="text-sm font-medium text-slate-700 block mb-2">Availability & Rate</label>
                <div className="inline-flex rounded-md bg-slate-50 p-1 gap-1">
                  <button
                    onClick={() => setOfferType('hire')}
                    className={`px-3 py-1 rounded-md text-sm ${offerType === 'hire' ? 'bg-blue-500 text-white' : 'text-slate-700'}`}>
                    Hire
                  </button>
                  <button
                    onClick={() => setOfferType('internship')}
                    className={`px-3 py-1 rounded-md text-sm ${offerType === 'internship' ? 'bg-blue-500 text-white' : 'text-slate-700'}`}>
                    Internship
                  </button>
                  <button
                    onClick={() => setOfferType('mentor')}
                    className={`px-3 py-1 rounded-md text-sm ${offerType === 'mentor' ? 'bg-blue-500 text-white' : 'text-slate-700'}`}>
                    Mentor
                  </button>
                </div>

                <div className="mt-3">
                  <label className="text-xs text-slate-500">Expected price / rate</label>
                  <div className="mt-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">SUI</span>
                    <input
                      type="text"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder="e.g. 50/hr or 1500/month"
                      className="pl-12 w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="mt-3 text-sm text-slate-600">
                  <strong className="capitalize">{offerType}</strong>
                  {offerPrice ? <span className="ml-2 text-slate-800">— {offerPrice}</span> : <span className="ml-2 text-slate-500">— no price set</span>}
                </div>
              </div>
            </div>
          </div>

      
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold mb-4">User Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-slate-600">Username</label>
                  <input value={username} onChange={(e)=>setUsername(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Email</label>
                  <input value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600">Bio</label>
                <textarea value={bio} onChange={(e)=>setBio(e.target.value)} rows={4} className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold mb-3">Skills</h3>

              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((s, idx)=> (
                  <span key={idx} className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-sm">
                    <span>{s}</span>
                    <button onClick={()=>removeSkill(idx)} className="p-0.5 rounded-full hover:bg-slate-200">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input value={skillInput} onChange={(e)=>setSkillInput(e.target.value)} placeholder="Add up to 10 skills" className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                <button onClick={addSkill} className="px-4 py-2 bg-blue-500 text-white rounded-md inline-flex items-center gap-2"><Plus size={14}/></button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold mb-4">Featured Works</h3>
              
              {/* Display added featured works */}
              {featuredWorks.length > 0 && (
                <div className="mb-6 space-y-3">
                  <p className="text-sm text-slate-600 font-medium">Added Works ({featuredWorks.length})</p>
                  {featuredWorks.map((work, idx) => (
                    <div key={work.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex gap-4">
                      {work.image && (
                        <img src={work.image} alt={work.title} className="w-16 h-16 rounded object-cover shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{work.title}</p>
                        <p className="text-sm text-slate-600">{work.skills}</p>
                      </div>
                      <button
                        onClick={() => removeFeaturedWork(idx)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new featured work form */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-4">
                <h4 className="font-medium text-slate-900">Add New Work</h4>
                
                <div>
                  <label className="text-sm text-slate-600">Project Title</label>
                  <input
                    type="text"
                    value={workTitle}
                    onChange={(e) => setWorkTitle(e.target.value)}
                    placeholder="e.g. E-commerce Platform Redesign"
                    className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-600">Skills & Frameworks Used</label>
                  <textarea
                    value={workSkills}
                    onChange={(e) => setWorkSkills(e.target.value)}
                    placeholder="e.g. React, Tailwind CSS, Node.js, MongoDB"
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-600">Project Image</label>
                  <div className="mt-2 flex gap-3 items-end">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleWorkImageChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-400 text-sm"
                      />
                    </div>
                    {workImage && (
                      <img src={workImage} alt="work preview" className="w-16 h-16 rounded object-cover" />
                    )}
                  </div>
                </div>

                <button
                  onClick={addFeaturedWork}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition inline-flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add Featured Work
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold mb-3">Contact & Socials</h3>

              <div className="space-y-3 mb-4">
                {socials.map((s, idx)=> (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{s.title}</div>
                      <div className="text-xs text-slate-500">{s.url}</div>
                    </div>
                    <button onClick={()=>removeSocial(idx)} className="p-2 rounded-md hover:bg-slate-100"><X size={14}/></button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input value={socialTitle} onChange={(e)=>setSocialTitle(e.target.value)} placeholder="Title (e.g., Twitter)" className="px-3 py-2 border rounded-md col-span-1 md:col-span-1" />
                <input value={socialUrl} onChange={(e)=>setSocialUrl(e.target.value)} placeholder="https://..." className="px-3 py-2 border rounded-md col-span-1 md:col-span-1" />
                <button onClick={addSocial} className="px-4 py-2 bg-blue-500 text-white rounded-md inline-flex items-center gap-2 justify-center"><Plus size={14}/> Add</button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Upload Work</h3>
                <p className="text-sm text-slate-500">Share a project or file that showcases your skills</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="px-4 py-2 bg-white border rounded-md cursor-pointer inline-flex items-center gap-2"><UploadCloud size={16}/> <span className="text-sm">Choose file</span>
                  <input type="file" className="hidden" />
                </label>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Upload</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
