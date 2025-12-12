import React from 'react'
import { motion } from 'framer-motion'
// import blockchainImg from '../assets/blockchain.jpg';
import NFTSIMg from '../../assets/Nfts.jpg'
import NFTSIMgs from '../../assets/morenft.jpg'
import NFTSIMgs2 from '../../assets/morenft2.jpg'
import Shareskills from '../../assets/shareskills.jpg'
import finder from '../../assets/finder.jpg'
import findtalents from '../../assets/findtalents.jpg'
import growth from '../../assets/growth.jpg'
import ideas from '../../assets/idea.jpg'
import sucesss from '../../assets/Sucess.jpg'
import nft3 from '../../assets/nft3.jpg'
import nft4 from '../../assets/nft4.jpg'

import { Briefcase, Palette, Users, Vote } from "lucide-react";
import Lottie from 'lottie-react'


export default function ProblemStack(){
 const cardImages = {
    skills: [
      Shareskills,
  
    ],
    nfts: [
   
      NFTSIMgs,
  
    ],
    collaborate: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
    ],
    governance: [

         finder,
  
    ],
      idea: [
 
      ideas,
  
    ]
  }

  const features = [
    {
      title: "Share Your Skills",
      description:
        "Offer services like content creation, design, coding, and more. Connect with clients who value your expertise on the decentralized marketplace.",
      imageKey: "skills"
    },
        {
      title: "Share Your ideas",
      description:
        "Offer services like content creation, design, coding, and more. Connect with clients who value your expertise on the decentralized marketplace.",
      imageKey: "idea"
    },
    {
      title: "Buy & Sell NFTs",
      description:
        "Trade unique digital assets, collectibles, and art. Own and monetize your creations on a secure, transparent blockchain.",
      imageKey: "nfts"
    },
    {
      title: "Collaborate on Projects",
      description:
        "Find partners, contributors, and investors. Build together and achieve common goals with verified community members.",
      imageKey: "collaborate"
    },
    {
      title: "Participate in Governance",
      description:
        "Vote on community decisions, proposals, and grant programs. Shape the future of the marketplace with your voice.",
      imageKey: "governance"
    },
  ]


  const cardVariant = {
    hidden: { opacity: 0, y: 24 },
    visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, type:'spring', stiffness: 120 } }),
    hover: { y: -8, boxShadow: '0 12px 30px rgba(2,6,23,0.12)', scale: 1.01 }
  }

  return (
    <section className="relative w-full py-24 bg-linear-to-b from-white to-brand-50 select-none">
      <div className=" mx-auto px-2 lg:px-4 space-y-6">
           <h2 className="text-4xl font-bold text-center text-slate-900 mb-4">
          What You Can Do
        </h2>
        <p className="text-center text-slate-600 max-w-2xl mx-auto mb-16">
          The Sui Community Marketplace empowers you to share skills, trade NFTs, collaborate on projects, and participate in governance decisions.
        </p>

        <div className="space-y-6 mt-12">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={cardVariant}
              className={`${f.bgColor} sticky  top-28  flex flex-col md:flex-row items-center justify-between gap-8 p-6 bg-white rounded-2xl shadow h-screen`}
              style={{ minHeight: 180 }}
            >
              <div    className="absolute inset-0 bg-cover bg-center rounded-lg"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 100%), url('${cardImages[f.imageKey]?.[0]}')`
                }}>

              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3 pt-10">
                  <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center">
                    {f.icon}
                  </div>
                  <h3 className="text-3xl text-white font-semibold">{f.title}</h3>
                </div>
                <p className="text-white/70 pl-20">{f.description}</p>
              </div>

              <div className="flex-1 flex items-center justify-center min-h-40">
                {/* Lottie placeholder: put actual animation JSON files at /public/animations/*.json */}
                <div className="w-56 h-40">
                  {/* If you don't have Lottie files, comment Lottie out and leave an illustrative SVG or image */}
                  {/* <Lottie animationData={ f.lottie ? require(`../animations/${f.lottie.split('/').pop()}`) : null } loop={true} /> */}
                </div>
              </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
