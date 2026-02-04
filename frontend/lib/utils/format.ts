/**
 * Format a Sui address for display
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format a balance in MIST to SUI
 */
export function formatBalance(balance: bigint | string, decimals = 9): string {
  const balanceBigInt = typeof balance === "string" ? BigInt(balance) : balance;
  const divisor = BigInt(10 ** decimals);
  const whole = balanceBigInt / divisor;
  const fraction = balanceBigInt % divisor;
  
  const fractionStr = fraction.toString().padStart(decimals, "0");
  const trimmedFraction = fractionStr.replace(/0+$/, "");
  
  if (trimmedFraction === "") {
    return whole.toString();
  }
  
  return `${whole}.${trimmedFraction}`;
}

/**
 * Format a USD value
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Format a percentage
 */
export function formatPercent(value: number, decimals = 2): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

/**
 * Format a timestamp to a readable date
 */
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

/**
 * Format a relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}
