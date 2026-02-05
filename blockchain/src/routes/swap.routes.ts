import { Router, Request, Response } from "express";
import { deepBookService } from "../services/deepbook.service.js";
import { suiService } from "../services/sui.service.js";
import { poolService } from "../services/pool.service.js";
import { SwapBuildRequest } from "../types/index.js";
import { TOKENS, isValidToken } from "../config/tokens.js";

const router = Router();

/**
 * GET /api/swap/pairs
 * Get all available trading pairs from DeepBook
 */
router.get("/pairs", async (req: Request, res: Response) => {
  try {
    const pools = await poolService.fetchPools();
    
    // Map pools to trading pairs
    const pairs = pools.map(pool => ({
      poolId: pool.poolId,
      poolName: pool.poolName,
      baseToken: {
        symbol: pool.baseCoin,
        decimals: pool.baseDecimals,
      },
      quoteToken: {
        symbol: pool.quoteCoin,
        decimals: pool.quoteDecimals,
      },
    }));
    
    res.json({ pairs });
  } catch (error) {
    throw error;
  }
});

/**
 * POST /api/swap/build
 * Build unsigned swap transaction
 */
router.post("/build", async (req: Request, res: Response) => {
  try {
    console.log("[BuildRoute] Received swap build request:", req.body);
    
    const { walletAddress, tokenIn, tokenOut, amountIn, minAmountOut } = req.body as SwapBuildRequest;

    // Validate required fields
    if (!walletAddress || !tokenIn || !tokenOut || !amountIn || !minAmountOut) {
      console.error("[BuildRoute] Missing required fields");
      return res.status(400).json({
        error: {
          message: "Missing required fields: walletAddress, tokenIn, tokenOut, amountIn, minAmountOut",
          code: "INVALID_REQUEST",
        },
      });
    }

    // Validate wallet address format
    if (!walletAddress.startsWith("0x") || walletAddress.length !== 66) {
      return res.status(400).json({
        error: {
          message: "Invalid wallet address format",
          code: "INVALID_WALLET_ADDRESS",
        },
      });
    }

    const result = await deepBookService.buildSwapTransaction({
      walletAddress,
      tokenIn: tokenIn.toUpperCase(),
      tokenOut: tokenOut.toUpperCase(),
      amountIn,
      minAmountOut,
    });

    res.json(result);
  } catch (error) {
    throw error;
  }
});

/**
 * GET /api/swap/balances/:walletAddress
 * Get token balances for a wallet
 */
router.get("/balances/:walletAddress", async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;

    if (!walletAddress.startsWith("0x") || walletAddress.length !== 66) {
      return res.status(400).json({
        error: {
          message: "Invalid wallet address format",
          code: "INVALID_WALLET_ADDRESS",
        },
      });
    }

    const rawBalances = await suiService.getAllBalances(walletAddress);
    
    console.log(`[BalanceRoute] Fetched ${rawBalances.length} raw balances from Sui`);
    rawBalances.forEach((bal: any) => {
      console.log(`[BalanceRoute] Raw: ${bal.coinType} = ${bal.totalBalance}`);
    });
    
    // Normalize coinType for comparison (handle both 0x2 and 0x0000...0002)
    const normalizeCoinType = (coinType: string) => {
      return coinType.replace(/^0x0+2::/, '0x2::');
    };
    
    // Extract symbol from coinType string (e.g., "0x...::module::SYMBOL" -> "SYMBOL")
    const extractSymbol = (coinType: string): string => {
      const parts = coinType.split('::');
      return parts[parts.length - 1] || 'UNKNOWN';
    };
    
    // Map raw balances - include ALL tokens with balance > 0
    const balances = rawBalances
      .filter((balance: any) => Number(balance.totalBalance) > 0) // Only non-zero balances
      .map((balance: any) => {
        const normalizedBalanceCoinType = normalizeCoinType(balance.coinType);
        
        // Try to find matching token in our config
        const tokenEntry = Object.entries(TOKENS).find(
          ([_, token]) => {
            const normalizedTokenCoinType = normalizeCoinType(token.coinType);
            return normalizedTokenCoinType === normalizedBalanceCoinType;
          }
        );
        
        if (tokenEntry) {
          // Known token from config
          const [symbol, tokenConfig] = tokenEntry;
          const formattedBalance = (Number(balance.totalBalance) / Math.pow(10, tokenConfig.decimals)).toFixed(6);
          console.log(`[BalanceRoute] Mapped ${symbol}: ${formattedBalance} (${balance.totalBalance} raw)`);
          return {
            symbol: tokenConfig.symbol,
            name: tokenConfig.symbol,
            balance: formattedBalance,
            balanceRaw: balance.totalBalance,
            decimals: tokenConfig.decimals,
            coinType: balance.coinType,
            iconUrl: "",
          };
        } else {
          // Unknown token - still show it with extracted symbol
          const symbol = extractSymbol(balance.coinType);
          const decimals = 9; // Default to 9 decimals for unknown tokens
          const formattedBalance = (Number(balance.totalBalance) / Math.pow(10, decimals)).toFixed(6);
          console.log(`[BalanceRoute] Unknown token ${symbol}: ${formattedBalance} (${balance.totalBalance} raw)`);
          console.log(`[BalanceRoute] CoinType: ${balance.coinType}`);
          return {
            symbol,
            name: symbol,
            balance: formattedBalance,
            balanceRaw: balance.totalBalance,
            decimals,
            coinType: balance.coinType,
            iconUrl: "",
          };
        }
      });

    console.log(`[BalanceRoute] Returning ${balances.length} balances (all non-zero)`);
    res.json({ balances });
  } catch (error) {
    throw error;
  }
});

/**
 * GET /api/swap/transaction/:txDigest
 * Get transaction status
 */
router.get("/transaction/:txDigest", async (req: Request, res: Response) => {
  try {
    const { txDigest } = req.params;

    const tx = await suiService.getTransactionStatus(txDigest);

    res.json({
      digest: tx.digest,
      status: tx.effects?.status?.status || "unknown",
      timestamp: tx.timestampMs,
      gasUsed: tx.effects?.gasUsed,
      effects: tx.effects,
    });
  } catch (error) {
    throw error;
  }
});

export default router;
