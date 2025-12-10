import React from "react";
import { motion } from "framer-motion";

// REUSABLE SCROLLING DECK COMPONENT
function InfiniteDeck({ items, reverse }) {
  return (
    <div className="relative w-full overflow-hidden pt-2 bg-white">
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: reverse ? ["100%", "-100%"] : ["-100%", "100%"] }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: "linear",
        }}
      >
        {[...items, ...items].map((item, index) => (
          <div
            key={index}
            className="text-xs md:text-xs font-semibold text-gray-700"
          >
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function LedgeVotesScrollingDeck() {
  const backedBy = [
    "Backed by Blockchain Security",
    "Trusted Identity Verification",
    "Zero Manipulation",
    "Real-time Transparency",
    "Cryptographic Integrity",
    "Multi-layer Fraud Prevention",
    "Sui Movement",
    "instant Settlement"
  ];

  const whatIsLedge = [
    "Sui-Exchange",
    "Skill Exchange",
    "NFT Marketplace ",
    "Decentralized, Transparent and Secured ",
    "Fast & Immutable  Records",
    "Fast Results for Everyone",
    "Future of Trust-Based Governance",
  ];

  return (
    <section className="w-full bg-white pt-20 ">
      {/* SECTION HEADING */}
      <h2 className="text-xs md:text-xs font-bold text-center text-blue-500 mb-1">
        Secured. Transparent. Decentralized.
      </h2>

      {/* FIRST DECK — Right → Left */}
      <InfiniteDeck items={backedBy} reverse={false} />

      {/* SECOND DECK — Left → Right */}
      <InfiniteDeck items={whatIsLedge} reverse={true} />
    </section>
  );
}
