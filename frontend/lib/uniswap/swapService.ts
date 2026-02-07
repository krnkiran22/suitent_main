import { ethers, BigNumber } from 'ethers';
import { Token, CurrencyAmount, TradeType, Percent } from '@uniswap/sdk-core';
import { AlphaRouter } from '@uniswap/smart-order-router';
import { Trade } from '@uniswap/v3-sdk';

// Ethereum Mainnet configuration
const ETH_MAINNET_CHAIN_ID = 1;
const INFURA_URL = `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID || 'demo'}`;

// Popular token addresses on Ethereum
const TOKENS = {
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  USDC: '0xA0b86a33E6417c64b7b0b8e5b7e4df866D0Be9F6',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
};

export class UniswapSwapService {
  private provider: ethers.providers.JsonRpcProvider;
  private router: AlphaRouter;
  private initialized: boolean = false;

  constructor() {
    // Initialize provider (fallback to public RPC)
    this.provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
    this.router = new AlphaRouter({ 
      chainId: ETH_MAINNET_CHAIN_ID, 
      provider: this.provider 
    });
  }

  /**
   * Initialize the service with proper error handling
   */
  async initialize(): Promise<boolean> {
    try {
      if (this.initialized) return true;
      
      // Test provider connection
      await this.provider.getBlockNumber();
      this.initialized = true;
      
      console.log('✅ UniswapSwapService initialized successfully');
      return true;
    } catch (error) {
      console.warn('⚠️ UniswapSwapService initialization failed:', error);
      return false;
    }
  }

  /**
   * Get optimal swap route using Uniswap V3 Alpha Router
   */
  async getSwapRoute(
    tokenInAddress: string,
    tokenOutAddress: string,
    amount: string,
    tradeType: TradeType = TradeType.EXACT_INPUT
  ) {
    try {
      await this.initialize();
      
      if (!this.initialized) {
        throw new Error('Service not initialized');
      }

      // Create token instances
      const tokenIn = new Token(ETH_MAINNET_CHAIN_ID, tokenInAddress, 18);
      const tokenOut = new Token(ETH_MAINNET_CHAIN_ID, tokenOutAddress, 18);
      
      // Convert amount to proper format
      const amountIn = CurrencyAmount.fromRawAmount(
        tokenIn, 
        ethers.utils.parseUnits(amount, tokenIn.decimals).toString()
      );

      // Get route from Alpha Router
      const route = await this.router.route(
        amountIn,
        tokenOut,
        tradeType,
        {
          recipient: '0x0000000000000000000000000000000000000000', // Placeholder
          slippageTolerance: new Percent(50, 10_000), // 0.50%
          deadline: Math.floor(Date.now() / 1000 + 1800), // 30 minutes
        }
      );

      if (!route) {
        throw new Error('No route found');
      }

      return {
        route,
        quote: route.quote.toExact(),
        gas: route.estimatedGasUsed.toString(),
        impact: route.trade.priceImpact.toFixed(2),
        success: true
      };

    } catch (error) {
      console.error('Uniswap route calculation failed:', error);
      return {
        route: null,
        quote: '0',
        gas: '0',
        impact: '0',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Execute swap transaction (simulation for demo)
   */
  async executeSwap(
    tokenInAddress: string,
    tokenOutAddress: string,
    amount: string,
    walletAddress?: string
  ) {
    try {
      // Get route first
      const routeResult = await this.getSwapRoute(tokenInAddress, tokenOutAddress, amount);
      
      if (!routeResult.success || !routeResult.route) {
        throw new Error(`Route calculation failed: ${routeResult.error}`);
      }

      // Simulate transaction execution
      console.log('🔄 Executing Uniswap swap...');
      console.log(`📤 Swapping ${amount} tokens`);
      console.log(`💱 Expected output: ${routeResult.quote}`);
      console.log(`⛽ Estimated gas: ${routeResult.gas}`);
      console.log(`📊 Price impact: ${routeResult.impact}%`);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Return mock transaction result
      return {
        success: true,
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        quote: routeResult.quote,
        gasUsed: routeResult.gas,
        priceImpact: routeResult.impact,
        route: routeResult.route
      };

    } catch (error) {
      console.error('Uniswap swap execution failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Swap execution failed',
        txHash: null
      };
    }
  }

  /**
   * Get token price using Uniswap pools
   */
  async getTokenPrice(tokenAddress: string, baseToken: string = TOKENS.USDC): Promise<number> {
    try {
      const routeResult = await this.getSwapRoute(tokenAddress, baseToken, '1');
      return routeResult.success ? parseFloat(routeResult.quote) : 0;
    } catch (error) {
      console.warn('Price fetch failed:', error);
      return 0;
    }
  }

  /**
   * Validate if token pair is supported
   */
  isTokenPairSupported(tokenInAddress: string, tokenOutAddress: string): boolean {
    const supportedTokens = Object.values(TOKENS);
    return supportedTokens.includes(tokenInAddress) && supportedTokens.includes(tokenOutAddress);
  }

  /**
   * Get supported tokens list
   */
  getSupportedTokens() {
    return TOKENS;
  }
}

// Export singleton instance
export const uniswapSwapService = new UniswapSwapService();

// Export token addresses for easy access
export { TOKENS as UNISWAP_TOKENS };

// Utility function for easy integration
export async function executeUniswapSwap(
  tokenIn: string,
  tokenOut: string,
  amount: string,
  walletAddress?: string
) {
  return await uniswapSwapService.executeSwap(tokenIn, tokenOut, amount, walletAddress);
}

// Quote function for price checking
export async function getUniswapQuote(
  tokenIn: string,
  tokenOut: string,
  amount: string
) {
  return await uniswapSwapService.getSwapRoute(tokenIn, tokenOut, amount);
}