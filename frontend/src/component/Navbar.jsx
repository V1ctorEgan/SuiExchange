import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Vote, Wallet, ContactIcon, NotebookIcon, WorkflowIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Lock, LogOut } from 'lucide-react'
// import WalletConnectModal from './WalletConnectModal'
import {
  ConnectButton,
  useWallet,
} from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient } from '@mysten/sui.js/client';

export default function Navbar(){
  const navigate = useNavigate()
  const { connected, account } = useWallet()
  const [open, setOpen] = useState(false)
  const [hasNavigated, setHasNavigated] = useState(false)
  
  useEffect(() => {
    if (connected && !hasNavigated) {
      setHasNavigated(true)
      navigate('/onboarding/role')
    }
  }, [connected, hasNavigated, navigate])
  
  return (
    <header className="w-full sticky top-0 z-50 bg-linear-to-b from-black/40 to-transparent backdrop-blur px-4 py-3 ">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center ">
          <div className="w-10 h-8 rounded-lg bg-blue-400 flex items-center justify-center text-white text-sui-300 font-bold">SUI</div>
          <div>Exchange</div>
        </Link>

        <nav className="flex items-center  gap-4">
          {connected && account?.address ? (
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="group relative bg-blue-500 px-5 py-2 rounded-2xl font-bold text-white overflow-hidden flex items-center gap-2"
            >
              <Wallet size={16} />
              <span className="hidden sm:inline">
                {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.div>
          ) : (
            <ConnectButton className="mx-auto" />
          )}
        </nav>
      </div>
    </header>
  )
}