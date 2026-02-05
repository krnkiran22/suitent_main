"use client";

import { useState } from "react";
import { 
  ConnectModal,
  useCurrentAccount,
  useDisconnectWallet 
} from "@mysten/dapp-kit";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { formatAddress } from "@/lib/utils/format";
import { WalletDropdown } from "./WalletDropdown";
import { WalletSelector } from "./WalletSelector";

export function ConnectButton() {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const { logout: turnkeyLogout, handleLogin, wallets: turnkeyWallets } = useTurnkey();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuiModalOpen, setIsSuiModalOpen] = useState(false);
  
  const turnkeyAddress = turnkeyWallets?.[0]?.accounts?.[0]?.address;
  const isTurnkeyConnected = !!turnkeyAddress;

  // Handler: Turnkey Selected
  const handleTurnkeySelect = async () => {
    setIsModalOpen(false);
    try {
      await handleLogin();
    } catch (e) {
      console.error("Turnkey login failed", e);
    }
  };

  // Handler: Sui Wallet Selected
  const handleSuiSelect = () => {
    setIsModalOpen(false);
    setIsSuiModalOpen(true);
  };

  // Handle Turnkey disconnect
  const handleTurnkeyDisconnect = async () => {
    try {
      await turnkeyLogout();
      
      // Clear all Turnkey-related localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.includes('turnkey') || key.includes('Turnkey')) {
          localStorage.removeItem(key);
        }
      });
      
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("[ConnectButton] Turnkey disconnect failed:", error);
    }
  };

  // Show Turnkey wallet if connected
  if (isTurnkeyConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-6 py-2.5 rounded-full font-medium text-sm transition-all border border-purple-500/30"
        >
          🔐 {formatAddress(turnkeyAddress, 4)}
        </button>

        {isDropdownOpen && (
          <WalletDropdown
            address={turnkeyAddress}
            onClose={() => setIsDropdownOpen(false)}
            onDisconnect={handleTurnkeyDisconnect}
          />
        )}
      </div>
    );
  }

  // Show browser wallet if connected
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
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-sui-blue hover:bg-blue-500 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-[0_0_15px_rgba(77,162,255,0.4)] hover:shadow-[0_0_25px_rgba(77,162,255,0.6)]"
      >
        Connect Wallet
      </button>

      {/* Official Sui Modal (Hidden until triggered) */}
      <ConnectModal
        trigger={<span className="hidden"></span>}
        open={isSuiModalOpen}
        onOpenChange={setIsSuiModalOpen}
      />

      {/* Custom Wallet Selector Modal */}
      <WalletSelector 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectTurnkey={handleTurnkeySelect}
        onSelectSui={handleSuiSelect}
      />
    </>
  );
}
