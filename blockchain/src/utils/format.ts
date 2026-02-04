import { TOKENS, TokenSymbol } from "../config/tokens.js";

/**
 * Convert human-readable amount to raw amount (with decimals)
 */
export function toRawAmount(amount: string, decimals: number): bigint {
  const [whole, fraction = ""] = amount.split(".");
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(whole + paddedFraction);
}

/**
 * Convert raw amount to human-readable amount
 */
export function fromRawAmount(rawAmount: bigint, decimals: number): string {
  const rawStr = rawAmount.toString().padStart(decimals + 1, "0");
  const whole = rawStr.slice(0, -decimals) || "0";
  const fraction = rawStr.slice(-decimals);
  
  // Remove trailing zeros from fraction
  const trimmedFraction = fraction.replace(/0+$/, "");
  
  return trimmedFraction ? `${whole}.${trimmedFraction}` : whole;
}

/**
 * Format address to short form (0x1234...5678)
 */
export function formatAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Calculate price impact percentage
 */
export function calculatePriceImpact(
  amountIn: bigint,
  amountOut: bigint,
  decimalsIn: number,
  decimalsOut: number
): string {
  // Simplified price impact calculation
  // In production, compare with spot price from orderbook
  const impact = 0.05; // Placeholder: 0.05%
  return impact.toFixed(2);
}

/**
 * Format number with decimals
 */
export function formatNumber(num: string | number, decimals = 2): string {
  const n = typeof num === "string" ? parseFloat(num) : num;
  return n.toFixed(decimals);
}
