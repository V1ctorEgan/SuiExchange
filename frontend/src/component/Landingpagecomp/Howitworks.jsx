import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, UserCheck, Briefcase, Gem, Users, Zap } from "lucide-react";

export default function Howitworks() {
  const [step, setStep] = useState(0);

  const cards = [
    {
      title: "Connect Your SUI Wallet",
      icon: <Wallet size={40} className="text-blue-500" />,
      description:
        "Securely connect your Sui wallet to access the marketplace. Your identity is verified on-chain with zero personal data exposure.",
      features: ["Secure authentication", "No central server", "Non-custodial"],
      button: "Next Step",
    },

    {
      title: "Create Your Profile",
      icon: <UserCheck size={40} className="text-purple-500" />,
      description:
        "Set up your marketplace profile as a Freelancer or Client. Add your skills, bio, portfolio, and build your on-chain reputation.",
      features: ["Verify your identity", "Add skills/portfolio", "Display ratings"],
      button: "Next Step",
    },

    {
      title: "Share Skills or Hire Talent",
      icon: <Briefcase size={40} className="text-green-500" />,
      description:
        "Offer your services with flexible pricing, or browse and hire talented freelancers. Everything is transparent and verifiable.",
      features: ["Post service offerings", "Browse talent pool", "Secure escrow"],
      button: "Next Step",
    },

    {
      title: "Mint & Trade NFTs",
      icon: <Gem size={40} className="text-pink-500" />,
      description:
        "Create digital assets of your work or collect unique pieces from other creators. Own, trade, and earn on the blockchain.",
      features: ["Mint NFTs easily", "Trade collectibles", "Earn royalties"],
      button: "Next Step",
    },

    {
      title: "Collaborate & Grow",
      icon: <Users size={40} className="text-orange-500" />,
      description:
        "Find partners, launch projects together, and build your network. Join DAOs and participate in community governance.",
      features: ["Find collaborators", "Launch projects", "Join governance"],
      button: "Next Step",
    },

    {
      title: "Earn & Withdraw",
      icon: <Zap size={40} className="text-yellow-500" />,
      description:
        "Earn SUI tokens from your work, NFT sales, and governance participation. Withdraw anytime with zero fees to your wallet.",
      features: ["Instant payouts", "Zero-fee withdrawals", "Multi-revenue streams"],
      button: "Get Started",
    },
  ];

  const slide = {
    hidden: { x: 120, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 140 }},
    exit: { x: -120, opacity: 0, transition: { duration: 0.3 }},
  };

  return (
    <section className="w-full pt-10 pb-20 bg-linear-to-b from-slate-50 to-blue-50">
      <div className="lg:max-w-5xl mx-auto lg:px-6 px-3">

        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-3">
          How SuiExchange Works
        </h2>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          Start earning and creating on the decentralized marketplace in 6 simple steps
        </p>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-10">
          {cards.map((_, idx) => (
            <motion.div
              key={idx}
              onClick={() => setStep(idx)}
              className={`h-2 rounded-full cursor-pointer transition-all ${
                idx === step ? 'bg-blue-500 w-8' : 'bg-slate-300 w-2'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>

        <div className="relative w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={slide}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full bg-white rounded-3xl shadow-xl border border-blue-100 p-8 md:p-12"
            >
              <div className="grid md:grid-cols-2 lg:gap-10 gap-4">
                {/* Left side info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      {cards[step].icon}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900">{cards[step].title}</h3>
                      <p className="text-sm text-blue-600 font-semibold">Step {step + 1} of {cards.length}</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-lg leading-relaxed">
                    {cards[step].description}
                  </p>

                  {/* Features list */}
                  <div className="lg:space-y-3 space-y-2">
                    {cards[step].features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-slate-700">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right side visual */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-full lg:h-64 h-50 bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-dashed border-blue-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mb-4 flex justify-center text-6xl">
                        {step === 0 && "🔐"}
                        {step === 1 && "👤"}
                        {step === 2 && "💼"}
                        {step === 3 && "💎"}
                        {step === 4 && "🤝"}
                        {step === 5 && "🚀"}
                      </div>
                      <p className="text-slate-600 font-medium">{cards[step].title}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-4 justify-center lg:mt-10 mt-4">
                <button
                  onClick={() => {
                    if (step === 0) setStep(cards.length - 1);
                    else setStep(step - 1);
                  }}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    if (step === cards.length - 1) setStep(0);
                    else setStep(step + 1);
                  }}
                  className="px-8 py-3 bg-blue-500 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-600 transition"
                >
                  {cards[step].button}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
