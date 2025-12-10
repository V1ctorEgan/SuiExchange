import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Code } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'


export default function RoleSelection() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 mb-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black">Welcome to</h1>
            <div className="flex items-center ">
              <span className="px-2 py-1 bg-blue-400 text-white font-bold rounded-lg text-2xl sm:text-3xl md:text-4xl lg:text-5xl">SUI</span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black">Exchange</h1>
            </div>
          </div>
          <p className="text-black/60 text-base sm:text-lg md:text-xl">Choose your role to get started</p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-black/50 hover:text-blue-400 mb-6 transition-colors mx-auto"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
          <button
            onClick={() => navigate('/onboarding/client')}
            className="group relative border border-black/20 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <div className="p-8 md:p-10 text-center">
              <div className="mb-6 flex justify-center">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Briefcase size={40} className="text-blue-600" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Client</h2>
              <p className="text-slate-600 mb-2 font-medium">Looking to explore and hire</p>
              <p className="text-slate-500 text-sm">Find and hire top Web3 talent for your projects</p>
            </div>
          </button>

       
          <button
            onClick={() => navigate('/onboarding/freelancer')}
            className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <div className="p-8 md:p-10 text-center">
              <div className="mb-6 flex justify-center">
                <div className="bg-purple-100 p-4 rounded-full">
                  <Code size={40} className="text-blue-600" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Freelancer</h2>
              <p className="text-slate-600 mb-2 font-medium">Be hired and sell NFTs</p>
              <p className="text-slate-500 text-sm">Showcase your skills and monetize your digital assets</p>
            </div>
          </button>
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400">Your wallet is connected. Choose a role to continue.</p>
        </div>
      </div>
    </div>
  )
}
