export interface Pool {
  poolId: string;
  poolName: string;
  baseCoin: string;
  quoteCoin: string;
  baseDecimals: number;
  quoteDecimals: number;
  lotSize: string;
  tickSize: string;
}

export interface QuoteRequest {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
}

export interface QuoteResponse {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountInRaw: string;
  estimatedAmountOut: string;
  estimatedAmountOutRaw: string;
  pricePerToken: string;
  priceImpact: string;
  poolId: string;
}

export interface SwapBuildRequest {
  walletAddress: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  minAmountOut: string;
}

export interface SwapBuildResponse {
  transaction: {
    txBytes: string;
    estimatedGas: string;
  };
  quote: {
    amountIn: string;
    estimatedAmountOut: string;
    minAmountOut: string;
    priceImpact: string;
  };
  poolId: string;
}

export interface TokenBalance {
  token: string;
  balance: string;
  balanceRaw: string;
}

export interface TransactionStatus {
  digest: string;
  status: string;
  timestamp?: string;
  gasUsed?: string;
  effects?: any;
}
