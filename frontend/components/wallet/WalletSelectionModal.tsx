"use client";

import { useState } from "react";
import { ConnectButton as DappKitConnect } from "@mysten/dapp-kit";
import Link from "next/link";

interface WalletSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletSelectionModal({ isOpen, onClose }: WalletSelectionModalProps) {
  const [selectedOption, setSelectedOption] = useState<"turnkey" | "sui" | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slush-card border border-slush-border rounded-[24px] max-w-md w-full p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slush-text hover:text-white transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-2">Connect Wallet</h2>
        <p className="text-slush-text text-sm mb-6">Choose your preferred wallet connection method</p>

        {/* Main Options */}
        {!selectedOption && (
          <div className="space-y-3">
            {/* Turnkey Option */}
            <button
              onClick={() => setSelectedOption("turnkey")}
              className="w-full bg-slush-input hover:bg-[#232942] border border-white/5 rounded-[20px] p-5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-2xl">
                  🔐
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-white font-bold text-lg">Turnkey Wallet</h3>
                  <p className="text-slush-text text-sm">Secure passkey authentication</p>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slush-text group-hover:text-white transition-colors">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </button>

            {/* Sui Wallets Option */}
            <button
              onClick={() => setSelectedOption("sui")}
              className="w-full bg-slush-input hover:bg-[#232942] border border-white/5 rounded-[20px] p-5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-sui-blue/20 rounded-full flex items-center justify-center text-2xl">
                  🌊
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-white font-bold text-lg">Sui Wallets</h3>
                  <p className="text-slush-text text-sm">Suiet, Welldone & more</p>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slush-text group-hover:text-white transition-colors">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </button>
          </div>
        )}

        {/* Turnkey Flow */}
        {selectedOption === "turnkey" && (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedOption(null)}
              className="flex items-center gap-2 text-slush-text hover:text-white transition-colors text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </button>

            <div className="bg-slush-bg rounded-[20px] p-5 border border-slush-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-xl">
                  🔐
                </div>
                <div>
                  <h3 className="text-white font-semibold">Turnkey Wallet</h3>
                  <p className="text-slush-text text-xs">Passkey-secured wallet</p>
                </div>
              </div>

              <Link
                href="/swap"
                onClick={onClose}
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white rounded-[16px] py-3 text-center font-bold transition-all"
              >
                Continue with Turnkey
              </Link>
            </div>
          </div>
        )}

        {/* Sui Wallets Flow */}
        {selectedOption === "sui" && (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedOption(null)}
              className="flex items-center gap-2 text-slush-text hover:text-white transition-colors text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </button>

            <div className="bg-slush-bg rounded-[20px] p-5 border border-slush-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-sui-blue/20 rounded-full flex items-center justify-center text-xl">
                  🌊
                </div>
                <div>
                  <h3 className="text-white font-semibold">Browser Wallets</h3>
                  <p className="text-slush-text text-xs">Suiet, Welldone, Sui Wallet</p>
                </div>
              </div>

              {/* DappKit Connect Button - Styled */}
              <div className="[&_button]:w-full [&_button]:bg-sui-blue [&_button]:hover:bg-blue-500 [&_button]:text-white [&_button]:rounded-[16px] [&_button]:py-3 [&_button]:font-bold [&_button]:transition-all">
                <DappKitConnect 
                  connectText="Connect Wallet"
                  onConnectSuccess={onClose}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
