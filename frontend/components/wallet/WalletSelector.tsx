'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

interface WalletSelectorProps {
  onClose?: () => void;
}

export function WalletSelector({ onClose }: WalletSelectorProps) {
  const router = useRouter();
  const currentAccount = useCurrentAccount();

  console.log('[WalletSelector] Rendering - currentAccount:', !!currentAccount);

  // Redirect when connected
  useEffect(() => {
    if (currentAccount) {
      router.push('/swap');
    }
  }, [currentAccount, router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-blue-500/20">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-700 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10">
          <h2 className="text-3xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">Choose how you want to connect to SuiTent</p>
        </div>

        {/* Wallet Options */}
        <div className="p-6 space-y-4">{/* Keep existing wallet options */}
          
          {/* Turnkey (Embedded Wallet) */}
          <div 
            className={`group relative overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
              selectedType === 'turnkey' 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-gray-700 hover:border-blue-500/50 bg-gray-800/50'
            }`}
            onClick={() => setSelectedType('turnkey')}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
                    🔐
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Embedded Wallet</h3>
                    <p className="text-sm text-gray-400">Email, SMS, or Passkey</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                  RECOMMENDED
                </span>
              </div>
              
              <p className="text-gray-300 mb-4">
                No extension needed. Sign in with email, SMS, or passkey. Perfect for beginners.
              </p>

              {selectedType === 'turnkey' && (
                <div className="mt-4 animate-fade-in">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push('/swap'); // Turnkey auth happens on swap page
                    }}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold hover:scale-105 transition-transform"
                  >
                    Continue with Turnkey
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Standard Wallets (Suiet, Welldone, Sui Wallet) */}
          <div 
            className={`group relative overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
              selectedType === 'standard' 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-gray-700 hover:border-blue-500/50 bg-gray-800/50'
            }`}
            onClick={() => setSelectedType('standard')}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl">
                    🌊
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Browser Wallet</h3>
                    <p className="text-sm text-gray-400">Suiet, Welldone, Sui Wallet</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full border border-blue-500/30">
                  ADVANCED
                </span>
              </div>
              
              <p className="text-gray-300 mb-4">
                Use your existing Sui wallet extension. Full control of your keys.
              </p>

              {/* Wallet Logos */}
              <div className="flex gap-3 mb-4">
                <div className="px-3 py-2 bg-gray-900 rounded-lg text-xs text-gray-400 font-semibold">
                  Suiet
                </div>
                <div className="px-3 py-2 bg-gray-900 rounded-lg text-xs text-gray-400 font-semibold">
                  Welldone
                </div>
                <div className="px-3 py-2 bg-gray-900 rounded-lg text-xs text-gray-400 font-semibold">
                  Sui Wallet
                </div>
              </div>

              {selectedType === 'standard' && (
                <div className="mt-4 animate-fade-in">
                  <div className="w-full">
                    <ConnectButton 
                      connectText="Connect Browser Wallet"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Make sure you have a Sui wallet extension installed
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-gray-900/50">
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-500">
              Don&apos;t have a wallet? <a href="https://suiet.app/" target="_blank" rel="noopener" className="text-blue-400 hover:underline">Get Suiet →</a>
            </p>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
