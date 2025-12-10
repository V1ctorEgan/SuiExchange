import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NFTSIMgs from '../../assets/morenft.jpg'
import nft3 from '../../assets/nft3.jpg'
import nft4 from '../../assets/nft4.jpg'
import { Search, Bell, Camera, Plus, X, UploadCloud, Award, Heart, ThumbsDown, CalendarCheck, Share2 } from 'lucide-react'

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
  const [offerType] = useState(localStorage.getItem('profile_offerType') || 'hire')
  const [offerPrice] = useState(localStorage.getItem('profile_offerPrice') || '150')
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const storedAvatar = localStorage.getItem('user_avatar')
    //   const storedName = localStorage.getItem('user_username')
      if (storedAvatar) setAvatarPreview(storedAvatar)
    //   if (storedName) setUsername(storedName)
    } catch (e) {
      // ignore localStorage errors
    }
  }, [])

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
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
  }

  const handleSave = () => {
    // stub: save profile data
    console.log({ username, email, bio, skills, socials })
    alert('Profile saved (stub)')
  }

  const renderTopbar = () => (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
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
        <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium">
          Save changes
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
              <h3 className="font-semibold mb-4">Featured Work</h3>
                      {/** Featured images: replace placeholders with actual assets */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[NFTSIMgs, nft3].map((imgSrc, i) => (
                          <div key={i} className="rounded-lg overflow-hidden bg-white">
                            <img src={imgSrc} alt={`Featured ${i+1}`} className="w-full h-40 object-cover" />
                            <div className="p-3">
                              <p className="font-semibold">Project Title {i+1}</p>
                              <p className="text-xs text-slate-500">Framework: React, Tailwind</p>
                              <p className="text-sm mt-2 text-slate-600">Short description of the project goes here.</p>
                            </div>
                          </div>
                        ))}
                      </div>
            </div>
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
    </div>
  )
}
