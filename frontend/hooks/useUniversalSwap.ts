"use client";

import { useState, useCallback } from "react";
import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { getSwapQuote } from "@/lib/api";

export function useUniversalSwap() {
  // Standard wallet only (Suiet, Welldone, Sui Wallet)
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  
  const walletAddress = currentAccount?.address;
  const walletType = 'standard';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);

  console.log(`[useUniversalSwap] Wallet Type: ${walletType}, Address: ${walletAddress}`);

  // Execute swap with automatic wallet detection
  const executeSwap = useCallback(
    async (tokenIn: string, tokenOut: string, amountIn: string, slippage: number = 0.01) => {
      console.log(`[useUniversalSwap] executeSwap: ${amountIn} ${tokenIn} -> ${tokenOut} (${walletType})`);

      if (!walletAddress) {
        const error = "Wallet not connected";
        console.error("[useUniversalSwap]", error);
        setError(error);
        return null;
      }

      setLoading(true);
      setError(null);
      setTxDigest(null);

      try {
        // Step 1: Get quote for minAmountOut
        console.log("[useUniversalSwap] Getting quote...");
        const quoteData = await getSwapQuote(tokenIn, tokenOut, amountIn);
        const minAmountOut = (parseFloat(quoteData.estimatedAmountOut) * (1 - slippage)).toFixed(6);
        
        // Step 2: Build transaction on frontend (avoids SDK version mismatch)
        console.log("[useUniversalSwap] Building transaction on frontend...");
        const tx = await buildSwapTransactionFrontend(
          tokenIn,
          tokenOut,
          amountIn,
          minAmountOut,
          walletAddress,
          suiClient
        );

        // Step 3: Execute transaction with browser wallet
        console.log("[useUniversalSwap] Executing with browser wallet...");
        
        const resultDigest = await new Promise<string>((resolve, reject) => {
          signAndExecute(
            { 
              transaction: tx,
            },
            {
              onSuccess: (result) => {
                console.log("[useUniversalSwap] ✅ Swap successful! Digest:", result.digest);
                resolve(result.digest);
              },
              onError: (err) => {
                console.error("[useUniversalSwap] ❌ Swap failed:", err);
                reject(err);
              },
            }
          );
        });

        console.log(`[useUniversalSwap] ✅ SUCCESS! Digest: ${resultDigest}`);
        setTxDigest(resultDigest);
        return resultDigest;

      } catch (err: any) {
        console.error("[useUniversalSwap] Error:", err);
        setError(err.message || "Swap failed");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [walletAddress, currentAccount, signAndExecute]
  );

  const reset = useCallback(() => {
    setError(null);
    setTxDigest(null);
  }, []);

  return {
    loading,
    error,
    txDigest,
    executeSwap,
    reset,
    walletType, // Expose wallet type for UI
  };
}

// Build transaction on frontend to avoid SDK version mismatch
async function buildSwapTransactionFrontend(
  tokenIn: string,
  tokenOut: string,
  amountIn: string,
  minAmountOut: string,
  walletAddress: string,
  suiClient: any
) {
  // DeepBook constants
  const DEEPBOOK_PACKAGE = "0x22be4cade64bf2d02412c7e8d0e8beea2f78828b948118d46735315409371a3c";
  const SUI_TYPE = "0x2::sui::SUI";
  const DEEP_TYPE = "0x36dbef866a1d62bf7328989a10fb2f07d769f4ee587c0de4a0a256e57e0a58a8::deep::DEEP";
  const DBUSDC_TYPE = "0xf7152c05930480cd740d7311b5b8b45c6f488e3a53a11c3f74a6fac36a52e0d7::DBUSDC::DBUSDC";
  
  const DEEP_SUI_POOL = "0x48c95963e9eac37a316b7ae04a0deb761bcdcc2b67912374d6036e7f0e9bae9f";
  const DBUSDC_SUI_POOL = "0x4405b50d791fd3346754e8171aaab6bc2ed26c2c46efdd033c14b30ae507ac33";
  const CLOCK = "0x6";

  const tx = new Transaction();
  tx.setSender(walletAddress);

  // Determine swap direction
  if (tokenIn === "SUI" && tokenOut === "DEEP") {
    // SUI -> DEEP swap
    const amountInRaw = BigInt(Math.floor(parseFloat(amountIn) * 1e9));
    const minOutRaw = BigInt(Math.floor(parseFloat(minAmountOut) * 1e6));

    const [suiCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInRaw)]);
    const zeroDeepBase = tx.moveCall({ target: "0x2::coin::zero", typeArguments: [DEEP_TYPE] });
    const zeroDeepFee = tx.moveCall({ target: "0x2::coin::zero", typeArguments: [DEEP_TYPE] });

    const [baseOut, quoteOut, deepOut] = tx.moveCall({
      target: `${DEEPBOOK_PACKAGE}::pool::swap_exact_quantity`,
      typeArguments: [DEEP_TYPE, SUI_TYPE],
      arguments: [
        tx.object(DEEP_SUI_POOL),
        zeroDeepBase,
        suiCoin,
        zeroDeepFee,
        tx.pure.u64(minOutRaw),
        tx.object(CLOCK),
      ],
    });

    tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);
  } else if (tokenIn === "DEEP" && tokenOut === "SUI") {
    // DEEP -> SUI swap
    const amountInRaw = BigInt(Math.floor(parseFloat(amountIn) * 1e6));
    const minOutRaw = BigInt(Math.floor(parseFloat(minAmountOut) * 1e9));

    const deepCoinType = `0x2::coin::Coin<${DEEP_TYPE}>`;
    const deepCoins = await suiClient.getCoins({ owner: walletAddress, coinType: DEEP_TYPE });
    
    if (!deepCoins.data || deepCoins.data.length === 0) {
      throw new Error("No DEEP coins found in wallet");
    }

    const [deepCoin] = tx.splitCoins(tx.object(deepCoins.data[0].coinObjectId), [tx.pure.u64(amountInRaw)]);
    const zeroSui = tx.moveCall({ target: "0x2::coin::zero", typeArguments: [SUI_TYPE] });
    const zeroDeepFee = tx.moveCall({ target: "0x2::coin::zero", typeArguments: [DEEP_TYPE] });

    const [baseOut, quoteOut, deepOut] = tx.moveCall({
      target: `${DEEPBOOK_PACKAGE}::pool::swap_exact_quantity`,
      typeArguments: [DEEP_TYPE, SUI_TYPE],
      arguments: [
        tx.object(DEEP_SUI_POOL),
        deepCoin,
        zeroSui,
        zeroDeepFee,
        tx.pure.u64(minOutRaw),
        tx.object(CLOCK),
      ],
    });

    tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);
  } else if (tokenIn === "SUI" && tokenOut === "DBUSDC") {
    // SUI -> DBUSDC swap
    const amountInRaw = BigInt(Math.floor(parseFloat(amountIn) * 1e9));
    const minOutRaw = BigInt(Math.floor(parseFloat(minAmountOut) * 1e6));

    const [suiCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInRaw)]);
    const zeroDbusdc = tx.moveCall({ target: "0x2::coin::zero", typeArguments: [DBUSDC_TYPE] });
    const zeroDeepFee = tx.moveCall({ target: "0x2::coin::zero", typeArguments: [DEEP_TYPE] });

    const [baseOut, quoteOut, deepOut] = tx.moveCall({
      target: `${DEEPBOOK_PACKAGE}::pool::swap_exact_quantity`,
      typeArguments: [DBUSDC_TYPE, SUI_TYPE],
      arguments: [
        tx.object(DBUSDC_SUI_POOL),
        zeroDbusdc,
        suiCoin,
        zeroDeepFee,
        tx.pure.u64(minOutRaw),
        tx.object(CLOCK),
      ],
    });

    tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);
  } else if (tokenIn === "DBUSDC" && tokenOut === "SUI") {
    // DBUSDC -> SUI swap
    const amountInRaw = BigInt(Math.floor(parseFloat(amountIn) * 1e6));
    const minOutRaw = BigInt(Math.floor(parseFloat(minAmountOut) * 1e9));

    const dbusdcCoins = await suiClient.getCoins({ owner: walletAddress, coinType: DBUSDC_TYPE });
    
    if (!dbusdcCoins.data || dbusdcCoins.data.length === 0) {
      throw new Error("No DBUSDC coins found in wallet");
    }

    const [dbusdcCoin] = tx.splitCoins(tx.object(dbusdcCoins.data[0].coinObjectId), [tx.pure.u64(amountInRaw)]);
    const zeroSui = tx.moveCall({ target: "0x2::coin::zero", typeArguments: [SUI_TYPE] });
    const zeroDeepFee = tx.moveCall({ target: "0x2::coin::zero", typeArguments: [DEEP_TYPE] });

    const [baseOut, quoteOut, deepOut] = tx.moveCall({
      target: `${DEEPBOOK_PACKAGE}::pool::swap_exact_quantity`,
      typeArguments: [DBUSDC_TYPE, SUI_TYPE],
      arguments: [
        tx.object(DBUSDC_SUI_POOL),
        dbusdcCoin,
        zeroSui,
        zeroDeepFee,
        tx.pure.u64(minOutRaw),
        tx.object(CLOCK),
      ],
    });

    tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);
  } else {
    throw new Error(`Unsupported swap: ${tokenIn} -> ${tokenOut}`);
  }

  return tx;
}
