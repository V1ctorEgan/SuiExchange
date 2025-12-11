import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Vote, Wallet, ContactIcon, NotebookIcon, WorkflowIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Lock, LogOut } from 'lucide-react'
import {
  ConnectButton,
  useWallet,
} from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
// import WalletConnectModal from './WalletConnectModal'

export default function Navbar(){
  const navigate = useNavigate()
//   const { wallet, disconnect } = useWallet()
  const [open, setOpen] = useState(false)
  
  const handleConnectWallet = () => {
    navigate('/onboarding/role')
  }
  
  return (
    <header className="w-full sticky top-0 z-50 bg-linear-to-b from-black/40 to-transparent backdrop-blur px-4 py-3 ">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center ">
          <div className="w-10 h-8 rounded-lg bg-blue-400 flex items-center justify-center text-white text-sui-300 font-bold">SUI</div>
          <div>Exchange</div>
        </Link>

        <nav className="flex items-center  gap-4">
                <motion.button
              onClick={handleConnectWallet}
              aria-label="Connect wallet"
            
              // disabled={isConnecting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-blue-500 px-5 py-2 rounded-2xl font-bold text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Wallet size={16} />
                <span className="hidden sm:inline">
                  Connect Wallet
                     {/* <ConnectButton className="mx-auto" /> */}
                  {/* {isConnecting ? 'Connecting...' : 'Connect Wallet'} */}
                </span>
              </span>
              <div className="absolute inset-0  bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.button>
          {/* <Link to="/marketplace" className="text-sm text-slate-300 hidden md:inline">Marketplace</Link>
          <Link to="/collaboration" className="text-sm text-slate-300 hidden md:inline">Collaborate</Link>
          <Link to="/governance" className="text-sm text-slate-300 hidden md:inline">Governance</Link> */}
          {/* {false ? (
            <div className="flex items-center gap-2">
              <div className="text-sm bg-slate-900 px-3 py-1 rounded">{wallet.address.slice(0,8)}...</div>
              <button onClick={disconnect} className="px-3 py-1 rounded border">Disconnect</button>
            </div>
          ) : (
            <>
              <button onClick={()=>setOpen(true)} className="px-4 py-2 rounded bg-sui-500 text-black font-semibold">Connect Wallet</button>
              <WalletConnectModal open={open} onClose={()=>setOpen(false)} />
            </>
          )} */}
        </nav>
      </div>
    </header>
  )
}
