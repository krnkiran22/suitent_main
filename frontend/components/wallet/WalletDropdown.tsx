import { useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { TokenBalanceList } from "./TokenBalanceList";
import { formatAddress } from "@/lib/utils/format";

interface WalletDropdownProps {
  address: string;
  onClose: () => void;
  onDisconnect: () => void;
}

export function WalletDropdown({ address, onClose, onDisconnect }: WalletDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close when clicking outside
  useClickOutside(dropdownRef, onClose);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    // TODO: Show toast notification
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-[calc(100%+8px)] right-0 w-[340px] bg-[#0a0a0f]/95 backdrop-blur-xl border border-sui-blue/20 rounded-2xl shadow-[0_0_30px_rgba(77,162,255,0.15)] overflow-hidden animate-dropdown z-50"
    >
      {/* Header: Address + Copy */}
      <div className="p-4 border-b border-white/5">
        <button
          onClick={copyAddress}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
        >
          <span className="text-sm font-mono text-white">{formatAddress(address, 6)}</span>
          <svg
            className="w-4 h-4 text-gray-400 group-hover:text-sui-blue transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
      </div>

      {/* Network Badge */}
      <div className="px-4 pt-3 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-green-400">Sui Testnet</span>
        </div>
      </div>

      {/* Token Balances */}
      <div className="px-4 py-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
          Your Tokens
        </h3>
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
          <TokenBalanceList address={address} />
        </div>
      </div>

      {/* Disconnect Button */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={onDisconnect}
          className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 font-semibold text-sm transition-all flex items-center justify-center gap-2 group"
        >
          <svg
            className="w-4 h-4 group-hover:rotate-12 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Disconnect Wallet
        </button>
      </div>
    </div>
  );
}
