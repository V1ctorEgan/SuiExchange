import { Zap, Wallet, Gem, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="text-slate-100 mt-20 border-t border-blue-500/20 bg-slate-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
               <Link to="/" className="flex items-center ">
          <div className="w-10 h-8 rounded-lg bg-blue-400 flex items-center justify-center text-white text-sui-300 font-bold">SUI</div>
          <div>Exchange</div>
        </Link>
            </div>
            <p className="text-black/60 mb-4">
              A decentralized community marketplace on Sui where you can share skills, 
              trade NFTs, collaborate on projects, and participate in governance decisions.
            </p>
            <div className="flex space-x-4">
              <Wallet className="w-5 h-5 text-blue-400" />
              <Gem className="w-5 h-5 text-purple-400" />
              <Users className="w-5 h-5 text-green-400" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Marketplace</h3>
            <ul className="space-y-2 text-black/60">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Skills & Services</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">NFT Gallery</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Collaborations</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Governance</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Community</h3>
            <ul className="space-y-2 text-black/60">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Docs</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-black/60">
          <p>&copy; 2025 SuiExchange. All rights reserved. Built on the Sui blockchain.</p>
        </div>
      </div>
    </footer>
  );
}
