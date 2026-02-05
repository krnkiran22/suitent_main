"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface WalletSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTurnkey: () => void;
  onSelectSui: () => void;
}

export function WalletSelector({ isOpen, onClose, onSelectTurnkey, onSelectSui }: WalletSelectorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Optional: Lock body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Don't render until client-side hydration is complete
  if (!mounted || !isOpen) return null;

  // THE FIX: createPortal teleports this div to document.body
  return createPortal(
    <div className="fixed inset-0 z-[9999] grid place-items-center p-4">
      
      {/* BACKDROP */}
      <div 
        className="fixed inset-0 bg-[#0a0a0f]/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* MODAL CARD */}
      <div className="relative w-full max-w-[400px] bg-[#0D111C] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Header with Close Button */}
        <div className="flex justify-between items-center p-6 pb-2">
          <h2 className="text-xl font-bold text-white tracking-wide">Connect Wallet</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Wallet Options List */}
        <div className="p-6 pt-4 flex flex-col gap-4">
          
          {/* Option 1: Turnkey */}
          <button 
            onClick={onSelectTurnkey}
            className="group relative flex items-center justify-between p-4 rounded-[24px] bg-[#131825] border border-white/5 hover:border-sui-blue/50 transition-all hover:bg-[#1A2133] text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                {/* Icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-[17px]">Turnkey Wallet</h3>
                <p className="text-gray-400 text-sm">Email & Passkey login</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-sui-blue group-hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </button>

          {/* Option 2: Sui Wallets */}
          <button 
            onClick={onSelectSui}
            className="group relative flex items-center justify-between p-4 rounded-[24px] bg-[#131825] border border-white/5 hover:border-sui-blue/50 transition-all hover:bg-[#1A2133] text-left"
          >
             <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#4DA2FF]/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                {/* Sui Icon */}
                <div className="w-5 h-6 bg-sui-blue rounded-b-full drop-shadow-[0_0_10px_rgba(77,162,255,0.8)]"></div>
              </div>
              <div>
                <h3 className="text-white font-bold text-[17px]">Sui Wallets</h3>
                <p className="text-gray-400 text-sm">Slush, Welldone, etc.</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-sui-blue group-hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </button>

        </div>

        {/* Footer */}
        <div className="p-6 pt-2 text-center bg-[#131825]/50 border-t border-white/5">
            <p className="text-xs text-gray-500 leading-relaxed">
                By connecting, you agree to our <span className="text-sui-blue hover:underline cursor-pointer">Terms</span> and <span className="text-sui-blue hover:underline cursor-pointer">Privacy Policy</span>.
            </p>
        </div>

      </div>
    </div>,
    document.body // This is the magic part that moves it out of the navbar
  );
}
