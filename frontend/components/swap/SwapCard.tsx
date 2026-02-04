// components/swap/SwapCard.tsx - Main swap component

"use client";

import { useState, useEffect, useCallback } from "react";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { useSwap } from "@/hooks/useSwap";
import { useBalances } from "@/hooks/useBalances";
import { getAllTokens, Token } from "@/lib/tokens";

export function SwapCard() {
  // Turnkey wallet
  const { wallets, handleLogin, authState } = useTurnkey();
  const walletAddress = wallets?.[0]?.accounts?.[0]?.address;
  const isConnected = authState === "authenticated";

  // Swap hook
  const {
    quote,
    loading,
    quoteLoading,
    error,
    txDigest,
    fetchQuote,
    executeSwap,
    reset,
  } = useSwap();

  // Balances
  const { balances, getBalance, refetch: refetchBalances } = useBalances(walletAddress);

  // Form state
  const [tokenIn, setTokenIn] = useState<Token>(getAllTokens()[0]); // SUI
  const [tokenOut, setTokenOut] = useState<Token>(getAllTokens()[1]); // USDC
  const [amountIn, setAmountIn] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  console.log("[SwapCard] Render - Connected:", isConnected, "Address:", walletAddress);

  // Fetch quote when amount changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (amountIn && parseFloat(amountIn) > 0) {
        console.log("[SwapCard] Fetching quote for:", amountIn, tokenIn.symbol);
        fetchQuote(tokenIn.symbol, tokenOut.symbol, amountIn);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [amountIn, tokenIn.symbol, tokenOut.symbol, fetchQuote]);

  // Handle swap direction toggle
  const handleSwapDirection = useCallback(() => {
    console.log("[SwapCard] Swapping direction");
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setAmountIn("");
    reset();
  }, [tokenIn, tokenOut, reset]);

  // Handle max button
  const handleMax = useCallback(() => {
    const balance = getBalance(tokenIn.symbol);
    console.log("[SwapCard] Setting max:", balance);
    // Leave a little for gas if SUI
    if (tokenIn.symbol === "SUI" && parseFloat(balance) > 0.01) {
      setAmountIn((parseFloat(balance) - 0.01).toFixed(4));
    } else {
      setAmountIn(balance);
    }
  }, [tokenIn.symbol, getBalance]);

  // Handle swap execution
  const handleSwap = async () => {
    console.log("[SwapCard] Executing swap...");
    const result = await executeSwap(tokenIn.symbol, tokenOut.symbol, amountIn);

    if (result) {
      console.log("[SwapCard] Swap successful!");
      setShowSuccess(true);
      setAmountIn("");
      refetchBalances();
    }
  };

  // Determine button state
  const getButtonState = () => {
    if (!isConnected) return { text: "Connect Wallet", disabled: false, action: handleLogin };
    if (!amountIn || parseFloat(amountIn) <= 0) return { text: "Enter Amount", disabled: true };
    if (parseFloat(amountIn) > parseFloat(getBalance(tokenIn.symbol))) {
      return { text: "Insufficient Balance", disabled: true };
    }
    if (quoteLoading) return { text: "Getting Quote...", disabled: true };
    if (loading) return { text: "Swapping...", disabled: true };
    return { text: "Swap", disabled: false, action: handleSwap };
  };

  const buttonState = getButtonState();

  return (
    <div className="swap-card">
      <h2 className="text-xl font-bold mb-6 text-center">Swap</h2>

      {/* Token In */}
      <div className="token-input-container">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>You Pay</span>
          <span>
            Balance: {getBalance(tokenIn.symbol)} {tokenIn.symbol}
            <button onClick={handleMax} className="ml-2 text-cyan-400 hover:text-cyan-300">
              MAX
            </button>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="token-selector">
            <img src={tokenIn.iconUrl} alt={tokenIn.symbol} className="w-6 h-6 rounded-full" />
            <span className="font-medium">{tokenIn.symbol}</span>
          </div>
          <input
            type="number"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            placeholder="0.0"
            className="amount-input"
          />
        </div>
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button onClick={handleSwapDirection} className="swap-direction-btn">
          ⇅
        </button>
      </div>

      {/* Token Out */}
      <div className="token-input-container">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>You Receive</span>
          <span>Balance: {getBalance(tokenOut.symbol)} {tokenOut.symbol}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="token-selector">
            <img src={tokenOut.iconUrl} alt={tokenOut.symbol} className="w-6 h-6 rounded-full" />
            <span className="font-medium">{tokenOut.symbol}</span>
          </div>
          <input
            type="text"
            value={quote?.tokenOut.estimatedAmount || ""}
            placeholder="0.0"
            disabled
            className="amount-input"
          />
        </div>
      </div>

      {/* Quote Details */}
      {quote && (
        <div className="swap-details">
          <div className="swap-details-row">
            <span>Rate</span>
            <span>1 {tokenIn.symbol} = {quote.exchangeRate} {tokenOut.symbol}</span>
          </div>
          <div className="swap-details-row">
            <span>Price Impact</span>
            <span>{quote.priceImpact}%</span>
          </div>
          <div className="swap-details-row">
            <span>Min. Received</span>
            <span>{quote.tokenOut.minAmount} {tokenOut.symbol}</span>
          </div>
          <div className="swap-details-row">
            <span>Network Fee</span>
            <span>~{quote.networkFee} SUI</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Swap Button */}
      <button
        onClick={buttonState.action}
        disabled={buttonState.disabled}
        className="swap-btn"
      >
        {loading && <span className="mr-2">⏳</span>}
        {buttonState.text}
      </button>

      {/* Success Message */}
      {showSuccess && txDigest && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="text-green-400 font-medium mb-2">✅ Swap Successful!</div>
          <a
            href={`https://suiscan.xyz/testnet/tx/${txDigest}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline text-sm break-all"
          >
            View on Explorer: {txDigest}
          </a>
          <button
            onClick={() => setShowSuccess(false)}
            className="mt-2 text-gray-400 text-sm hover:text-white block"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-2 bg-gray-800/50 rounded text-xs text-gray-500">
          <div>Wallet: {walletAddress ? `${walletAddress.substring(0, 10)}...` : "Not connected"}</div>
          <div>Quote Loading: {quoteLoading ? "Yes" : "No"}</div>
          <div>Swap Loading: {loading ? "Yes" : "No"}</div>
        </div>
      )}
    </div>
  );
}
