import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import blockchainImg from '../assets/blockchain.jpg';
import NFTSIMg from '../assets/Nfts.jpg'
import NFTSIMgs from '../assets/morenft.jpg'
import NFTSIMgs2 from '../assets/morenft2.jpg'
import Shareskill from '../assets/shareskill.jpg'
import finder from '../assets/finder.jpg'
import findtalents from '../assets/findtalents.jpg'
import growth from '../assets/growth.jpg'
import ideas from '../assets/idea.jpg'
import sucesss from '../assets/Sucess.jpg'
import nft3 from '../assets/nft3.jpg'
import nft4 from '../assets/nft4.jpg'

export default function ImageCarousel({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Carousel images array - using blockchain.jpg as placeholder
  const images = [nft4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl mt-4  bg-black">
      {/* Background Image */}
      <motion.img
        key={currentIndex}
        src={images[currentIndex]}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 w-full h-full object-cover"
        alt={`Slide ${currentIndex}`}
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content - positioned on top of background */}
      <div className="relative z-10 flex items-center justify-center h-full">
        {children}
      </div>

      {/* Dots Indicator */}
      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`rounded-full transition-all ${
              idx === currentIndex ? 'bg-white w-8 h-2' : 'bg-white/50 w-2 h-2'
            }`}
          />
        ))}
      </div> */}

      {/* Navigation Arrows */}
      {/* <button
        onClick={() => {
          setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 transition-all text-xl font-bold"
      >
        ←
      </button>
      <button
        onClick={() => {
          setCurrentIndex((prev) => (prev + 1) % images.length);
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 transition-all text-xl font-bold"
      >
        →
      </button> */}
    </div>
  );
}
