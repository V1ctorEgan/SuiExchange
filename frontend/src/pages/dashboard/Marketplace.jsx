import React, { useState, useEffect } from 'react'
import { Search, Bell, Star, Heart, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '@suiet/wallet-kit'
import { useSuiClient } from '@mysten/dapp-kit'
import useStore from '../../store/useStore'
import { 
  getAllServiceListings, 
  filterListingsByCategory, 
  searchListings 
} from '../../smartContractFn'
import blockchainImg from '../../assets/blockchain.jpg'

export default function Marketplace() {
  const navigate = useNavigate()
  const wallet = useWallet()
  const suiClient = useSuiClient()
  const store = useStore()
  
  const [selectedCategory, setSelectedCategory] = useState('all services')
  const [likedTalents, setLikedTalents] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  const categories = [
    'all services', 
    'nft arts', 
    'software engineering', 
    'designers', 
    'smart contract developer', 
    'frontend', 
    'backend',
    'internship',
    'mentorship'
  ]

  // Load listings from blockchain
  useEffect(() => {
    loadListings()
  }, [])

  const loadListings = async () => {
    setLoading(true)
    try {
      // Get listings from blockchain
      const blockchainListings = await getAllServiceListings(suiClient)
      
      // Get local profiles from store
      const localProfiles = store.profiles || []
      
      // Merge blockchain listings with local profile data
      const mergedListings = blockchainListings.map(listing => {
        // Find matching local profile
        const profile = localProfiles.find(p => p.walletAddress === listing.seller)
        
        return {
          id: listing.listingId,
          name: profile?.username || formatAddress(listing.seller),
          rating: profile?.rating || 4.8,
          reviews: profile?.reviews || 0,
          image: profile?.username?.slice(0,2).toUpperCase() || 'U',
          profileImage: profile?.avatar || null,
          cardImage: profile?.avatar || blockchainImg,
          skills: profile?.skills || [],
          price: listing.price,
          likes: profile?.likes || 0,
          listingId: listing.listingId,
          seller: listing.seller,
          active: listing.active,
          ...listing
        }
      })
      
      // If no blockchain listings, use local profiles
      if (mergedListings.length === 0 && localProfiles.length > 0) {
        const localListings = localProfiles.map(p => ({
          id: p.id,
          name: p.username,
          rating: p.rating || 4.8,
          reviews: p.reviews || 0,
          image: p.username?.slice(0,2).toUpperCase() || 'U',
          profileImage: p.avatar || null,
          cardImage: p.avatar || blockchainImg,
          skills: p.skills || [],
          price: p.price || 0,
          likes: p.likes || 0,
          isLocal: true
        }))
        setListings(localListings)
      } else {
        setListings(mergedListings)
      }
      
    } catch (error) {
      console.error('Failed to load listings:', error)
      // Fallback to local profiles
      const localProfiles = store.profiles || []
      const fallbackListings = localProfiles.map(p => ({
        id: p.id,
        name: p.username,
        rating: p.rating || 4.8,
        reviews: p.reviews || 0,
        image: p.username?.slice(0,2).toUpperCase() || 'U',
        profileImage: p.avatar || null,
        cardImage: p.avatar || blockchainImg,
        skills: p.skills || [],
        price: p.price || 0,
        likes: p.likes || 0,
        isLocal: true
      }))
      setListings(fallbackListings)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = (talentId) => {
    setLikedTalents((prev) => ({
      ...prev,
      [talentId]: !prev[talentId],
    }))
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Filter listings
  const filteredByCategory = filterListingsByCategory(listings, selectedCategory)
  const filteredListings = searchListings(filteredByCategory, searchTerm)

  const renderTopbar = () => (
    <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
      <div className="flex items-center gap-3 sm:gap-8 flex-1 justify-between w-full">
        <h2 className="text-blue-500 font-semibold text-sm sm:text-base hidden lg:block">Marketplace</h2>
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search talents..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          {wallet.connected && (
            <span className="text-xs sm:text-sm text-slate-600 hidden sm:inline border border-black/20 lg:px-2 rounded-lg">
              {formatAddress(wallet.account?.address)}
            </span>
          )}
          <Bell size={18} className="text-slate-600 cursor-pointer hover:text-slate-900" />
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer">
            {store.user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      {renderTopbar()}
      <div className="flex-1 overflow-auto lg:pb-0 pb-15">
        <div className="px-3 sm:px-6 md:px-8 py-6 sm:py-12 text-black">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            Find the Top <span className='text-blue-400'>Web3 talent</span>
          </h1>
          <p className="text-sm sm:text-base text-black/60 mb-6">
            Decentralised freelance services, build the future and chat
          </p>

          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-slate-900 border border-black/10 hover:bg-blue-400'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 sm:p-6 md:p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={48} className="text-blue-500 animate-spin" />
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500">No listings found</p>
              <p className="text-sm text-slate-400 mt-2">Try a different category or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {filteredListings.map((talent) => (
                <div 
                  key={talent.id} 
                  onClick={() => navigate(`/dashboard/profile/${talent.id}`)}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4 px-4 py-2 justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {talent.profileImage ? (
                        <img 
                          src={talent.profileImage} 
                          alt={talent.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {talent.image}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">{talent.name}</p>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-yellow-500 font-semibold text-sm">{talent.rating}</span>
                          <span className="text-slate-500 text-xs">({talent.reviews})</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleLike(talent.id) }}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <Heart 
                          size={18} 
                          className={`transition-colors ${
                            likedTalents[talent.id] 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-slate-400 hover:text-red-500'
                          }`}
                        />
                      </button>
                      <span className="text-xs text-slate-600 font-medium">{talent.likes}</span>
                    </div>
                  </div>
           
                  {talent.cardImage ? (
                    <div 
                      className="h-48 w-full relative flex items-end bg-cover bg-center"
                      style={{ backgroundImage: `url(${talent.cardImage})` }}
                    >
                      <div className="absolute bottom-4 left-4 text-white text-sm font-semibold opacity-90 bg-black/50 px-2 py-1 rounded">
                        {talent.title || 'Web3 Developer'}
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 w-full relative flex items-center justify-center bg-slate-100 text-slate-600">
                      <div className="text-sm">No featured project</div>
                    </div>
                  )}

                  <div className="p-4">
                    <div className="mb-4">
                      <div className="overflow-hidden">
                        <div className="flex gap-2 animate-scroll">
                          {[...talent.skills, ...talent.skills].map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium whitespace-nowrap"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <hr className="mb-4 text-black/20" />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          {talent.isLocal ? 'Starting at' : 'On-chain price'}
                        </p>
                        <p className="text-xl font-bold text-blue-600">
                          {talent.price > 0 ? `${talent.price} SUI` : '$150/hr'}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/dashboard/profile/${talent.id}`)
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        Hire
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}