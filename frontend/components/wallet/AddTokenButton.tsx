"use client";

import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useState, useEffect } from "react";

const DEEP_TOKEN = {
  type: "0x36dbef866a1d62bf7328989a10fb2f07d769f4ee587c0de4a0a256e57e0a58a8::deep::DEEP",
  symbol: "DEEP",
  decimals: 6,
  name: "DeepBook Token",
};

interface AddTokenButtonProps {
  walletAddressOverride?: string;
}

export function AddTokenButton({ walletAddressOverride }: AddTokenButtonProps = {}) {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [deepBalance, setDeepBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const walletAddress = walletAddressOverride || currentAccount?.address;

  const checkBalance = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    try {
      const coins = await suiClient.getCoins({
        owner: walletAddress,
        coinType: DEEP_TOKEN.type,
      });
      
      const total = coins.data.reduce((sum, coin) => sum + BigInt(coin.balance), 0n);
      const humanReadable = (Number(total) / 1e6).toFixed(6);
      
      setDeepBalance(humanReadable);
      console.log(`DEEP Balance: ${humanReadable} DEEP (${coins.data.length} coins)`);
      coins.data.forEach((coin, i) => {
        console.log(`  Coin ${i + 1}: ${coin.coinObjectId} - ${Number(coin.balance) / 1e6} DEEP`);
      });
    } catch (error) {
      console.error("Error checking DEEP balance:", error);
      setDeepBalance("Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBalance();
  }, [walletAddress]);

  const copyTokenAddress = () => {
    navigator.clipboard.writeText(DEEP_TOKEN.type);
    alert("DEEP token address copied! Add it manually in your wallet settings.");
  };

  if (!currentAccount) return null;

  return (
    <div className="p-4 border border-gray-700 rounded-lg bg-gray-800/50">
      <h3 className="text-lg font-semibold mb-2">DEEP Token Info</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-gray-400">Balance:</span>{" "}
          <span className="font-mono text-green-400">
            {loading ? "Loading..." : deepBalance !== null ? `${deepBalance} DEEP` : "..."}
          </span>
        </div>
        
        <div>
          <span className="text-gray-400">Token Address:</span>
          <div className="flex items-center gap-2 mt-1">
            <code className="text-xs bg-gray-900 px-2 py-1 rounded flex-1 overflow-x-auto">
              {DEEP_TOKEN.type}
            </code>
            <button
              onClick={copyTokenAddress}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs whitespace-nowrap"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-400 mt-3 p-2 bg-gray-900 rounded">
          <p className="font-semibold mb-1">To add DEEP to your wallet:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open your wallet settings</li>
            <li>Find "Add Custom Token" or "Manage Coins"</li>
            <li>Paste the token address above</li>
            <li>DEEP token should appear with your balance</li>
          </ol>
        </div>

        <button
          onClick={checkBalance}
          disabled={loading}
          className="w-full mt-3 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
        >
          {loading ? "Checking..." : "Refresh Balance"}
        </button>
      </div>
    </div>
  );
}
