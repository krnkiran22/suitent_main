"use client";

import { useWallet } from "@/hooks/useWallet";
import { formatAddress } from "@/lib/utils/format";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function AddressDisplay() {
  const { address, isConnected } = useWallet();
  const [copied, setCopied] = useState(false);

  if (!isConnected || !address) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
      <span className="font-mono text-sm text-sui-steel">
        {formatAddress(address, 6)}
      </span>
      <button
        onClick={handleCopy}
        className="text-sui-mist hover:text-white transition-colors"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );
}
