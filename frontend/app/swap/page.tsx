"use client";

import { SwapCard } from "@/components/swap/SwapCard";

export default function SwapPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black">
      <SwapCard />
    </main>
  );
}


  return (
    <>
      <Header />
      <main className="min-h-screen w-full bg-[#0a0a0f] flex items-center justify-center px-4 pt-20">
        
        {/* Main Swap Card */}
        <div className="w-full max-w-[480px] bg-[#121217] rounded-3xl border border-white/5 shadow-2xl overflow-hidden p-2">
          
          {/* Tabs */}
          <div className="flex items-center gap-6 px-6 py-4 mb-2">
            <button className="text-white font-bold text-lg border-b-2 border-white pb-1">Swap</button>
            <button className="text-gray-500 font-medium text-lg hover:text-gray-300 pb-1">OTC</button>
            <button className="text-gray-500 font-medium text-lg hover:text-gray-300 pb-1">Limit</button>
          </div>

          {/* Input Section (Sell) */}
          <div className="bg-[#1A1B23] rounded-2xl p-4 mb-2 relative group focus-within:ring-1 focus-within:ring-sui-blue/50 transition-all">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">Sell</span>
              <span className="text-gray-400 text-sm font-medium">Balance: 0</span>
            </div>
            <div className="flex items-center justify-between">
              <input 
                type="number" 
                placeholder="0"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="bg-transparent text-4xl font-medium text-white outline-none w-full placeholder-gray-600"
              />
              <button className="flex items-center gap-2 bg-[#2A2B36] hover:bg-[#343541] text-white px-3 py-1.5 rounded-full transition-colors font-medium ml-4">
                <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                USDC
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <div className="flex gap-2 mt-3">
               <button className="px-2 py-0.5 bg-[#2A2B36] rounded text-xs text-gray-400 hover:text-white transition-colors">Max</button>
               <button className="px-2 py-0.5 bg-[#2A2B36] rounded text-xs text-gray-400 hover:text-white transition-colors">50%</button>
            </div>
          </div>

          {/* Switcher Arrow */}
          <div className="h-2 relative flex items-center justify-center z-10">
            <button className="bg-[#121217] border-4 border-[#121217] rounded-lg p-1.5 text-gray-400 hover:text-white hover:bg-[#2A2B36] transition-all absolute">
              <ArrowDown className="w-[18px] h-[18px]" />
            </button>
          </div>

          {/* Output Section (Buy) */}
          <div className="bg-[#1A1B23] rounded-2xl p-4 mt-2 mb-6 focus-within:ring-1 focus-within:ring-sui-blue/50 transition-all">
             <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">Buy</span>
            </div>
            <div className="flex items-center justify-between">
              <input 
                type="number" 
                placeholder="0"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="bg-transparent text-4xl font-medium text-white outline-none w-full placeholder-gray-600"
              />
              <button className="flex items-center gap-2 bg-[#2A2B36] hover:bg-[#343541] text-white px-3 py-1.5 rounded-full transition-colors font-medium ml-4">
                 <div className="w-5 h-5 bg-sui-blue rounded-full"></div>
                SUI
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full bg-sui-blue hover:bg-blue-500 text-white font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(77,162,255,0.3)] transition-all transform active:scale-[0.98]">
            Connect Wallet
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Powered by <span className="text-gray-300 font-semibold">SuiTent AI</span>
          </p>

        </div>
      </main>
    </>
  );
}
