import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Star, Heart, ExternalLink, MessageCircle } from 'lucide-react'
import blockchainImg from '../../assets/blockchain.jpg'
import NFTSIMg from '../../assets/Nfts.jpg'
import NFTSIMgs from '../../assets/morenft.jpg'
import nft3 from '../../assets/nft3.jpg'
import nft4 from '../../assets/nft4.jpg'
import { Link } from 'react-router-dom'
import useStore from '../../store/useStore'

export default function ProfileInfo() {
  const navigate = useNavigate()
  const { talentId } = useParams()
  const [isLiked, setIsLiked] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [ratingSubmitted, setRatingSubmitted] = useState(false)

  // Prefer persisted profile from store
  const store = useStore()
  const persisted = talentId ? store.getProfileById(talentId) : null

  // Default talent data with proper fallbacks
  const defaultTalent = {
    id: talentId || 1,
    name: 'Alice Johnson',
    rating: 5.0,
    reviews: 128,
    likes: 234,
    image: 'AJ',
    profileImage: blockchainImg,
    bio: 'Passionate Web3 developer with 5+ years of experience in building decentralized applications. Specialized in React, TypeScript, and smart contract integration.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Web3.js', 'Smart Contracts', 'Node.js'],
    price: 150,
    featured: [
      { id: 1, title: 'DeFi Dashboard', description: 'A comprehensive DeFi trading dashboard', image: NFTSIMgs },
      { id: 2, title: 'NFT Marketplace', description: 'Full-stack NFT marketplace with Sui integration', image: nft3 },
    ],
    socials: [
      { name: 'GitHub', url: 'https://github.com', icon: '🔗' },
      { name: 'Website', url: 'https://example.com', icon: '🌐' },
      { name: 'Twitter', url: 'https://twitter.com', icon: '𝕏' },
    ],
  }

  // Merge persisted data with defaults, ensuring critical fields exist
  const talentData = persisted ? {
    ...defaultTalent,
    ...persisted,
    price: persisted.price ?? defaultTalent.price, // Ensure price is never undefined
    rating: persisted.rating ?? defaultTalent.rating,
    reviews: persisted.reviews ?? defaultTalent.reviews,
    likes: persisted.likes ?? defaultTalent.likes,
    bio: persisted.bio ?? defaultTalent.bio,
    skills: persisted.skills ?? defaultTalent.skills,
    featured: persisted.featured ?? defaultTalent.featured,
    socials: persisted.socials ?? defaultTalent.socials,
  } : defaultTalent

  const handleHire = () => {
    // Navigate to hiring flow or show modal
    alert(`Hiring ${talentData.name}...`)
  }

  const handleChat = () => {
    // Navigate to messages or create new chat
    navigate('/dashboard/messages')
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleSubmitRating = () => {
    if (userRating > 0) {
      console.log(`Submitted rating: ${userRating} stars for ${talentData.name}`)
      setRatingSubmitted(true)
      setTimeout(() => {
        setRatingSubmitted(false)
        setUserRating(0)
      }, 2000)
    }
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50 ">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate('/dashboard/marketplace')}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-500 transition-colors"
        >
          <ArrowLeft size={24} />
          <span className="hidden sm:inline text-sm font-medium">Back to Marketplace</span>
        </button>
        <h2 className="text-lg font-semibold text-slate-900">Talent Profile</h2>
        <div className="w-6" /> {/* Spacer for alignment */}
      </div>

      <div className=" mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:pb-0 pb-15">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center sm:items-start gap-4">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center shrink-0 border-4 border-blue-100">
                {talentData.profileImage ? (
                  <img src={talentData.profileImage} alt={talentData.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-slate-400">{talentData.image}</span>
                )}
              </div>
              <button
                onClick={toggleLike}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <Heart size={20} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : '#64748b'} />
                <span className="text-sm font-medium text-slate-700">{talentData.likes + (isLiked ? 1 : 0)}</span>
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{talentData.name}</h1>

              {/* Rating */}
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < Math.floor(talentData.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900">{talentData.rating.toFixed(1)}</span>
                </div>
                <span className="text-slate-600 text-sm">({talentData.reviews} reviews)</span>
              </div>

              {/* Rate - FIXED: Added safety check for price */}
              <div className="mb-6">
                <p className="text-slate-600 text-sm mb-2">Hourly Rate</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${typeof talentData.price === 'number' ? talentData.price.toFixed(0) : '150'}/hr
                </p>
              </div>

              {/* Bio */}
              <p className="text-slate-600 leading-relaxed mb-4">{talentData.bio}</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t border-slate-200 pt-6 mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Connect with {talentData.name.split(' ')[0]}</h3>
            <div className="flex flex-wrap gap-3">
              {talentData.socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-600 rounded-lg transition-colors text-sm font-medium"
                >
                  <span>{social.icon}</span>
                  {social.name}
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Skills & Expertise</h3>
          <div className="flex flex-wrap gap-3">
            {talentData.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Featured Work */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Featured Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {talentData.featured.map((project) => (
              <div key={project.id} className="rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow">
                <img src={project.image} alt={project.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h4 className="font-semibold text-slate-900">{project.title}</h4>
                  <p className="text-sm text-slate-600">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rate Talent */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Rate {talentData.name.split(' ')[0]}</h3>
          <p className="text-slate-600 text-sm mb-6">Share your experience working with this talent</p>

          <div className="flex flex-col items-center sm:items-start gap-6">
            {/* Star Rating */}
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={40}
                    className={`cursor-pointer transition-colors ${
                      (hoverRating || userRating) >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Rating Display */}
            {userRating > 0 && (
              <div className="text-center sm:text-left">
                <p className="text-lg font-semibold text-slate-900">
                  {userRating === 1 && 'Could be better'}
                  {userRating === 2 && 'Not quite there'}
                  {userRating === 3 && 'Average work'}
                  {userRating === 4 && 'Very good'}
                  {userRating === 5 && 'Excellent work'}
                </p>
                <p className="text-slate-600 text-sm mt-1">{userRating} out of 5 stars</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmitRating}
              disabled={userRating === 0}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                ratingSubmitted
                  ? 'bg-green-500 text-white'
                  : userRating > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {ratingSubmitted ? '✓ Rating Submitted' : 'Submit Rating'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleChat}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-400 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors text-lg"
          >
            <MessageCircle size={20} />
            Chat with {talentData.name.split(' ')[0]}
          </button>
          <button
            onClick={handleHire}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
          >
            💼 Hire {talentData.name.split(' ')[0]}
          </button>
        </div>
      </div>
    </div>
  )
}