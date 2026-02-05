"use client";

import { useState } from "react";
import { 
  ConnectButton as DappKitConnectButton, 
  useCurrentAccount,
  useDisconnectWallet 
} from "@mysten/dapp-kit";
import { formatAddress } from "@/lib/utils/format";
import { WalletDropdown } from "./WalletDropdown";

export function ConnectButton() {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (currentAccount) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all border border-white/10"
        >
          {formatAddress(currentAccount.address, 4)}
        </button>

        {isDropdownOpen && (
          <WalletDropdown
            address={currentAccount.address}
            onClose={() => setIsDropdownOpen(false)}
            onDisconnect={() => {
              disconnect();
              setIsDropdownOpen(false);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="[&_button]:bg-sui-blue [&_button]:hover:bg-blue-500 [&_button]:text-white [&_button]:px-6 [&_button]:py-2.5 [&_button]:rounded-full [&_button]:font-medium [&_button]:text-sm [&_button]:transition-all [&_button]:shadow-[0_0_15px_rgba(77,162,255,0.4)] hover:[&_button]:shadow-[0_0_25px_rgba(77,162,255,0.6)]">
      <DappKitConnectButton connectText="Connect Wallet" />
    </div>
  );
}
