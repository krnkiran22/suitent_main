"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { ArrowDown } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { useUniversalSwap } from "@/hooks/useUniversalSwap";
import { useBalances } from "@/hooks/useBalances";
import { getAllTokens, Token } from "@/lib/tokens";
import { TokenSelector } from "@/components/swap/TokenSelector";
import { UnifiedConnectButton } from "@/components/wallet/UnifiedConnectButton";

export default function SwapPage() {
  // Get all tokens
  const allTokens = getAllTokens();
  
  // Form state
  const [tokenIn, setTokenIn] = useState<Token>(allTokens[0]); // SUI
  const [tokenOut, setTokenOut] = useState<Token>(allTokens[1]); // DEEP
  const [amountIn, setAmountIn] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Swap execution hook (supports both wallet types)
  const {
    loading,
    error: swapError,
    txDigest,
    executeSwap,
    reset,
    walletType,
  } = useUniversalSwap();

  // Get wallet address from hook
  const standardAccount = useCurrentAccount();
  const { wallets: turnkeyWallets } = useTurnkey();
  const turnkeyAddress = turnkeyWallets?.[0]?.accounts?.[0]?.address;
  const walletAddress = standardAccount?.address || turnkeyAddress;
  const isConnected = !!walletAddress;

  // Balances
  const { balances, getBalance, refetch: refetchBalances } = useBalances(walletAddress);

  return (
    <>
      <Header />
      
      {/* Page Background - Slush Navy */}
      <main className="min-h-screen w-full bg-[#0a0a0f] flex items-center justify-center px-4 pt-24 pb-12">
        
        {/* Main Swap Card */}
        <div className="w-full max-w-[460px] flex flex-col gap-4">
            
            {/* Header Title */}
            <div className="flex justify-between items-center px-2 mb-2">
                <h1 className="text-white text-xl font-semibold tracking-wide">Swap</h1>
                <button className="text-slush-text hover:text-white transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                </button>
            </div>

            {/* INPUT CARD 1: YOU PAY */}
            <div className="relative bg-slush-card rounded-[24px] p-5 border border-slush-border hover:border-white/10 transition-colors group">
                <div className="flex justify-between mb-3">
                    <span className="text-slush-text font-medium text-sm">You pay</span>
                    <span className="text-slush-text font-medium text-sm flex items-center gap-1">
                        Balance: <span className="text-white">{fromToken.balance}</span>
                        <button className="text-sui-blue text-xs bg-sui-blue/10 px-2 py-0.5 rounded-full hover:bg-sui-blue/20 transition-colors ml-2 font-bold">MAX</button>
                    </span>
                </div>
                
                <div className="flex items-center justify-between gap-4">
                    {/* Amount Input */}
                    <input 
                        type="number" 
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-transparent text-4xl font-semibold text-white placeholder-white/20 outline-none w-full"
                    />

                    {/* Token Select Pill */}
                    <button className="flex items-center gap-2 bg-slush-input hover:bg-[#232942] pl-2 pr-4 py-1.5 rounded-full transition-all border border-white/5 shadow-sm">
                        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-sm">
                           {fromToken.icon}
                        </div>
                        <span className="text-lg font-bold text-white">{fromToken.symbol}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-400 mt-0.5"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                </div>
                
                {/* USD Approx */}
                <div className="mt-2 text-slush-text text-sm font-medium">
                    ${amount ? (parseFloat(amount) * 1.04).toFixed(2) : "0.00"}
                </div>
            </div>

            {/* SWITCHER ARROW (Absolute centered) */}
            <div className="relative h-2 z-10 flex items-center justify-center">
                <button className="bg-[#0a0a0f] p-2 rounded-xl border-4 border-[#0a0a0f] text-sui-blue hover:text-white hover:bg-sui-blue hover:scale-110 transition-all shadow-xl">
                    <ArrowDown className="w-5 h-5" strokeWidth={3} />
                </button>
            </div>

            {/* INPUT CARD 2: YOU RECEIVE */}
            <div className="bg-slush-card rounded-[24px] p-5 border border-slush-border hover:border-white/10 transition-colors">
                <div className="flex justify-between mb-3">
                    <span className="text-slush-text font-medium text-sm">You receive</span>
                </div>
                
                <div className="flex items-center justify-between gap-4">
                    {/* Amount Output (Read Only) */}
                    <input 
                        type="text" 
                        placeholder="0"
                        readOnly
                        value={amount ? (parseFloat(amount) * 1.45).toFixed(4) : ""}
                        className="bg-transparent text-4xl font-semibold text-white placeholder-white/20 outline-none w-full"
                    />

                    {/* Token Select Pill */}
                    <button className="flex items-center gap-2 bg-slush-input hover:bg-[#232942] pl-2 pr-4 py-1.5 rounded-full transition-all border border-white/5 shadow-sm">
                        <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-sm text-white">
                           {toToken.icon}
                        </div>
                        <span className="text-lg font-bold text-white">{toToken.symbol}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-400 mt-0.5"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                </div>

                {/* Price Rate */}
                <div className="mt-2 flex justify-between items-center text-sm">
                     <span className="text-slush-text font-medium">$0.00</span>
                     <span className="text-sui-blue font-medium bg-sui-blue/10 px-2 py-1 rounded-lg text-xs">
                        1 {fromToken.symbol} = 1.45 {toToken.symbol}
                     </span>
                </div>
            </div>

            {/* INFO ACCORDION (Gas/Slippage) */}
            <div className="px-4 py-3 bg-white/5 rounded-2xl flex justify-between items-center text-sm border border-white/5">
                <span className="text-slush-text">Network Cost</span>
                <div className="flex items-center gap-2 text-white font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sui-blue"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    $0.002
                </div>
            </div>

            {/* MAIN ACTION BUTTON */}
            <button 
                className="w-full mt-2 bg-sui-blue hover:bg-blue-500 text-white text-lg font-bold py-4 rounded-[20px] shadow-[0_0_30px_rgba(77,162,255,0.3)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                onClick={() => setIsSwapping(!isSwapping)}
            >
                {isSwapping ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Confirming...
                    </>
                ) : (
                    "Review Swap"
                )}
            </button>

        </div>
      </main>
    </>
  );
}
