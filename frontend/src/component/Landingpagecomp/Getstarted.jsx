import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wallet, Users, Palette, TrendingUp } from 'lucide-react'

export default function Getstarted() {
  const navigate = useNavigate()
  
  const steps = [
    {
      icon: <Wallet size={32} className="text-blue-500" />,
      title: "Connect Wallet",
      description: "Link your SUI wallet to get started securely"
    },
    {
      icon: <Users size={32} className="text-purple-500" />,
      title: "Select Role",
      description: "Choose if you're a Client or Freelancer"
    },
    {
      icon: <Palette size={32} className="text-pink-500" />,
      title: "Sell NFTs & Skills",
      description: "Showcase your work, NFTs, or services"
    },
    {
      icon: <TrendingUp size={32} className="text-green-500" />,
      title: "Grow & Collaborate",
      description: "Build your reputation and earn on SUI"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <section className="py-20 px-4   lg:mx-20 mx-5 rounded-xl ">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-bold mb-3 text-center">Get Started in 4 Steps</h2>
        <p className="text-xl mb-12 text-slate-600 text-center lg:max-w-3xl mx-auto">
          Join the decentralized Sui Community Marketplace and start trading skills, NFTs, and collaborating with verified members.
        </p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 "
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-white/50  backdrop-blur rounded-xl p-6 border border-black/20 hover:border-blue-500/50 hover:bg-white/70 transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-blue-500/10 rounded-lg">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-12">
          <motion.button
            onClick={() => navigate('/onboarding/role')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-10 rounded-xl shadow-lg transition-all"
          >
            Explore Marketplace
          </motion.button>
        </div>
      </motion.div>
    </section>
  )
}
