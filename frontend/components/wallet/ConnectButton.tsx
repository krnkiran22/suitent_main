"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { formatAddress } from "@/lib/utils/format";
import { AuthState } from "@turnkey/react-wallet-kit";
import { WalletDropdown } from "./WalletDropdown";

export function ConnectButton() {
  const { handleLogin, logout, authState, address } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isConnected = authState === AuthState.Authenticated && address;

  if (isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all border border-white/10"
        >
          {formatAddress(address, 4)}
        </button>

        {isDropdownOpen && (
          <WalletDropdown
            address={address}
            onClose={() => setIsDropdownOpen(false)}
            onDisconnect={() => {
              logout();
              setIsDropdownOpen(false);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => handleLogin()}
      className="bg-sui-blue hover:bg-blue-500 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-[0_0_15px_rgba(77,162,255,0.4)] hover:shadow-[0_0_25px_rgba(77,162,255,0.6)]"
    >
      Get Started
    </button>
  );
}
