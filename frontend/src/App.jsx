import React from 'react'
import { Shield, Lock, ChevronRight, Users, BarChart3, Clock,Globe } from 'lucide-react';
import { motion } from 'framer-motion'
import Lottie from 'lottie-react';
import Balloting from './Balloting.json'
import RotatingText from './component/RotatingText';
import InfiniteDeck from './component/InfiniteDeck'
import ImageCarousel from './component/ImageCarousel'
import { Link, useNavigate } from 'react-router-dom'




export default function App(){
    const navigate = useNavigate()
  const backed = ["Backed by SUI","Community Driven","Decentralized Governance","Skill Exchange","LFT Marketplace","Secure & Transparent"]
  const whatIs = ["Secure Digital Voting","Decentralized Marketplace","Collaborative Projects","Transparent Grants","Community-Owned"]
  const handleConnectWallet = () => {
    navigate('/onboarding/role')
  }
  return (
    <div className="pt-10 lg:pt-0">
      <main className="mx-auto px-2 sm:px-4 md:px-6">
        <section className="relative overflow-hidden text-white px-2 sm:px-4">
          {/* <ImageCarousel> */}
          <div className='bg-linear-to-br from-gray-600 to-white-700 w-full rounded-lg sm:rounded-xl mt-4 sm:mt-6 md:mt-10'>
            <div className='rounded-lg sm:rounded-xl mx-2 sm:mx-6 md:mx-10 pb-4 md:pb-4'>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="mb-4 sm:mb-6 md:mb-8 inline-block"
                >
                  <div className="pt-3 sm:pt-4 md:pt-5 rounded-3xl">
                    <Lottie animationData={Balloting} className="w-20 h-20 sm:w-24 sm:h-24 md:w-30 md:h-30 mx-auto" />
                  </div>
                </motion.div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6 px-2">
                  The Decentralized SUI <br /> Community Marketplace — 
                  <div className='inline-block'>
                    <RotatingText
                      texts={[
                        "Trade NFTS",
                        "Share Your Skills ",
                        "Hire Talents",
                      ]}
                      mainClassName="px-1 sm:px-2 md:px-3 overflow-hidden text-blue-500 py-0.5 sm:py-1 md:py-2 lg:text-5xl justify-center rounded-lg  sm:text-base md:text-lg"
                      staggerFrom={"last"}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-120%" }}
                      staggerDuration={0.025}
                      splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                      transition={{ type: "spring", damping: 30, stiffness: 400 }}
                      rotationInterval={2000}
                    />
                  </div>
                </h1>

                <motion.p 
                  initial={{y:8,opacity:0}} 
                  animate={{y:0,opacity:1}} 
                  transition={{delay:0.1}} 
                  className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto px-3 sm:px-4"
                >
                  Trade skills, sell LFTs and collectibles, find collaborators, and participate in governance — all on SUI.
                </motion.p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2 sm:px-4 mb-4">
                  <motion.button
                     onClick={handleConnectWallet}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-6 sm:px-8 py-2 sm:py-3 bg-blue-500 accent flex justify-center items-center text-black rounded-xl sm:rounded-2xl font-bold text-sm sm:text-md shadow-[0_0_40px_rgba(6,182,212,0.4)] overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2 text-center">
                      Connect Wallet
                      <ChevronRight size={18} />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
          {/* </ImageCarousel> */}

          <InfiniteDeck/>
        </section>
      </main>
    </div>
  )
}
