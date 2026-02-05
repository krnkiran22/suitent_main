"use client";

import { ConnectButton as DappKitConnect } from "@mysten/dapp-kit";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { useState } from "react";

export function UnifiedConnectButton() {
  const [showOptions, setShowOptions] = useState(false);
  const { wallets: turnkeyWallets } = useTurnkey();
  const turnkeyAddress = turnkeyWallets?.[0]?.accounts?.[0]?.address;

  // If Turnkey is connected, show that
  if (turnkeyAddress) {
    return (
      <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 text-sm">
        🔐 Turnkey: {turnkeyAddress.slice(0, 6)}...{turnkeyAddress.slice(-4)}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Browser Wallet Connect */}
      <DappKitConnect connectText="🌊 Connect Browser Wallet" />
      
      {/* Turnkey Option */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-gray-900 text-gray-500">or</span>
        </div>
      </div>
      
      <a
        href="/absswap"
        className="block w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center font-semibold transition-colors"
      >
        🔐 Use Turnkey Wallet
      </a>
    </div>
  );
}
