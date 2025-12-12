// src/components/PushInitializer.jsx

import { useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import * as PushChat from '../utils/pushChat';

/**
 * PushInitializer
 * 
 * This component initializes Push Protocol when user connects wallet.
 * It doesn't render anything visible - just handles Push setup in the background.
 * 
 * Place this component at the root of your dashboard or app.
 */
export function PushInitializer() {
  const currentAccount = useCurrentAccount();

  useEffect(() => {
    // Only initialize if wallet is connected
    if (!currentAccount?.address) {
      console.log('⏳ Wallet not connected yet');
      return;
    }

    async function initPush() {
      try {
        console.log('🔄 Initializing Push Protocol...');
        
        // Initialize Push with user's wallet
        await PushChat.initializePush(currentAccount.signer);
        
        console.log('✅ Push Protocol initialized successfully!');
        console.log('📱 Chat is now available');
        
      } catch (error) {
        console.error('❌ Push Protocol initialization failed:', error);
        
        // Don't block the app if Push fails
        // Chat features just won't work
        if (error.message.includes('network')) {
          console.warn('⚠️ Network issue - chat may not work properly');
        }
      }
    }

    initPush();

    // Cleanup when wallet disconnects
    return () => {
      if (!currentAccount) {
        console.log('🔌 Wallet disconnected - cleaning up Push');
        PushChat.disconnectPush();
      }
    };
  }, [currentAccount]);

  // This component doesn't render anything
  return null;
}