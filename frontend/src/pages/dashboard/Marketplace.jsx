import React, { useState } from 'react'
import { Search, Bell, Star, Heart } from 'lucide-react'
import blockchainImg from '../../assets/blockchain.jpg';
import NFTSIMg from '../../assets/Nfts.jpg'
import NFTSIMgs from '../../assets/morenft.jpg'
import nft3 from '../../assets/nft3.jpg'
import nft4 from '../../assets/nft4.jpg'
import { Link } from 'react-router-dom'

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [likedTalents, setLikedTalents] = useState({})

  const categories = ['all services', 'nft arts', 'software engineering', 'designers', 'smart contract developer', 'frontend', 'backend']

  const handleLike = (talentId) => {
    setLikedTalents((prev) => ({
      ...prev,
      [talentId]: !prev[talentId],
    }))
  }

  const talents = [
    {
      id: 1,
      name: 'Alice Johnson',
      rating: 5.0,
      reviews: 128,
      image: 'AJ',
      profileImage: blockchainImg,
      cardImage: blockchainImg,
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Web3.js'],
      price: 150,
      likes: 234,
    },
    {
      id: 2,
      name: 'Bob Smith',
      rating: 4.8,
      reviews: 95,
      image: 'BS',
      profileImage: nft3,
      cardImage: NFTSIMg,
      skills: ['Rust', 'Solidity', 'Smart Contracts', 'Blockchain', 'Web3'],
      price: 200,
      likes: 189,
    },
    {
      id: 3,
      name: 'Carol Davis',
      rating: 4.9,
      reviews: 156,
      image: 'CD',
      profileImage: NFTSIMgs,
      cardImage: NFTSIMgs,
      skills: ['UI Design', 'Figma', 'UX Research', 'Prototyping'],
      price: 120,
      likes: 301,
    },
    {
      id: 4,
      name: 'David Wilson',
      rating: 4.7,
      reviews: 87,
      image: 'DW',
      profileImage: null,
      cardImage: blockchainImg,
      skills: ['Node.js', 'PostgreSQL', 'GraphQL', 'MongoDB', 'API Design'],
      price: 160,
      likes: 156,
    },
    {
      id: 5,
      name: 'Eve Martinez',
      rating: 5.0,
      reviews: 203,
      image: 'EM',
      profileImage: nft4,
      cardImage: NFTSIMg,
      skills: ['Vue.js', 'JavaScript', 'CSS', 'Web Development'],
      price: 140,
      likes: 412,
    },
    {
      id: 6,
      name: 'Frank Chen',
      rating: 4.6,
      reviews: 72,
      image: 'FC',
      profileImage: null,
      cardImage: NFTSIMgs,
      skills: ['3D Design', 'Blender', 'Animation', 'Game Development'],
      price: 180,
      likes: 267,
    },
  ]

  const renderTopbar = () => (
    <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 ">
      <div className="flex items-center gap-3 sm:gap-8 flex-1 justify-between w-full">
        <h2 className="text-blue-500 font-semibold text-sm sm:text-base hidden lg:block ">Marketplace</h2>
         <Link to="/" className="flex items-center lg:hidden ">
          <div className="w-10 h-8 rounded-lg bg-blue-400 flex items-center justify-center text-white text-sui-300 font-bold">SUI</div>
          <div>Exchange</div>
        </Link>
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search talents..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      <div className="flex items-center gap-3 sm:gap-6">
        <span className="text-xs sm:text-sm text-slate-600 hidden sm:inline border border-black/20 lg:px-2  rounded-lg ">0x742d...FEd9</span>
        <Bell size={18} className="text-slate-600 cursor-pointer hover:text-slate-900" />
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer">
          U
        </div>
      </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full  ">
      {renderTopbar()}
      <div className="flex-1 overflow-auto  ">
    
        <div className="px-3 sm:px-6 md:px-8 py-6 sm:py-12 text-black ">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Find the Top <span className='text-blue-400'>Web3 talent</span> </h1>
          <p className="text-sm sm:text-base text-black/60 mb-6">Decentralised freelance services, build the future and chat</p>

      
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {talents.map((talent) => (
              <div key={talent.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                  
                  
                  <div className="flex items-center gap-3 mb-4 px-4 py-2 justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {talent.profileImage ? (
                        <img 
                          src={talent.profileImage} 
                          alt={talent.name}
                          className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
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
                        onClick={() => handleLike(talent.id)}
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
           
                <div 
                  className="h-48 w-full  relative flex items-end bg-cover bg-center"
                  style={{ backgroundImage: `url(${talent.cardImage})` }}
                >
                  <div className="absolute bottom-4 left-4 text-white text-sm font-semibold opacity-90 bg-black/50 px-2 py-1 rounded">
                    Web3 Developer
                  </div>
                </div>

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

                  {/* Price and Hire */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Starting at</p>
                      <p className="text-xl font-bold text-blue-600">${talent.price}/hr</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                      Hire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

