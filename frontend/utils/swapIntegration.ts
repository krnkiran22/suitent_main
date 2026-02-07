/**
 * Swap Integration Utilities
 * 
 * This file provides utilities to integrate AI-driven swap intents
 * with the existing swap functionality across the application.
 */

// Types
interface SwapParams {
  fromToken: string;
  toToken: string;
  amount: string;
}

interface SwapResult {
  success: boolean;
  message: string;
  txHash?: string;
}

type SwapTriggerFunction = (params: SwapParams) => Promise<SwapResult>;

// Global swap trigger function that can be called from anywhere
let globalSwapTrigger: SwapTriggerFunction | null = null;

/**
 * Register the global swap trigger function
 * This should be called from the swap page component
 */
export const registerSwapTrigger = (triggerFunction: SwapTriggerFunction | null): void => {
  globalSwapTrigger = triggerFunction;
  // Also make it available on window for backward compatibility
  if (typeof window !== 'undefined') {
    (window as any).triggerSwap = triggerFunction;
  }
};

/**
 * Execute a swap using the registered trigger function
 */
export const executeGlobalSwap = async (swapParams: SwapParams): Promise<SwapResult> => {
  if (globalSwapTrigger) {
    return await globalSwapTrigger(swapParams);
  } else {
    throw new Error('Swap trigger not registered. Make sure to call registerSwapTrigger from the swap component.');
  }
};

/**
 * Check if swap trigger is available
 */
export const isSwapTriggerAvailable = (): boolean => {
  return globalSwapTrigger !== null;
};

/**
 * Parse swap intent from natural language
 * This is a backup parser in case the AI backend fails
 */
export const parseSwapIntent = (message: string): SwapParams | null => {
  const swapPattern = /swap\s+(\d+\.?\d*)\s+(\w+)\s+to\s+(\w+)/i;
  const match = message.match(swapPattern);
  
  if (match) {
    return {
      amount: match[1],
      fromToken: match[2].toUpperCase(),
      toToken: match[3].toUpperCase()
    };
  }
  
  return null;
};

/**
 * Format swap confirmation message
 */
export const formatSwapConfirmation = (swapData: SwapParams): string => {
  return `Ready to swap ${swapData.amount} ${swapData.fromToken} to ${swapData.toToken}?`;
};

/**
 * Format swap success message
 */
export const formatSwapSuccess = (swapData: SwapParams): string => {
  return `Successfully swapped ${swapData.amount} ${swapData.fromToken} to ${swapData.toToken}!`;
};

/**
 * Format swap error message
 */
export const formatSwapError = (error: Error): string => {
  return `Swap failed: ${error.message || 'Unknown error'}`;
};