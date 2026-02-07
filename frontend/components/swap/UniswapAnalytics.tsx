import { useEffect, useState } from 'react';
import { useUniswapSwap, UNISWAP_TOKENS } from '@/hooks/useUniswapSwap';

interface UniswapAnalyticsProps {
  tokenSymbol?: string;
  showDebugInfo?: boolean;
}

/**
 * Background analytics component using Uniswap SDK
 * This component demonstrates our integration with Uniswap Protocol
 * for enhanced price discovery and liquidity analysis
 */
export function UniswapAnalytics({ tokenSymbol = 'ETH', showDebugInfo = false }: UniswapAnalyticsProps) {
  const [priceData, setPriceData] = useState<Record<string, number>>({});
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const { getTokenPrice, getQuote, isServiceReady } = useUniswapSwap();

  // Fetch token prices using Uniswap V3 pools
  useEffect(() => {
    if (!isServiceReady) return;

    const fetchPrices = async () => {
      try {
        const tokenPairs = [
          { symbol: 'WETH', address: UNISWAP_TOKENS.WETH },
          { symbol: 'USDC', address: UNISWAP_TOKENS.USDC },
          { symbol: 'WBTC', address: UNISWAP_TOKENS.WBTC },
          { symbol: 'DAI', address: UNISWAP_TOKENS.DAI }
        ];

        const prices: Record<string, number> = {};
        
        for (const token of tokenPairs) {
          try {
            const price = await getTokenPrice(token.address);
            prices[token.symbol] = price;
            
            if (showDebugInfo) {
              console.log(`📊 Uniswap Price ${token.symbol}: $${price}`);
            }
          } catch (error) {
            if (showDebugInfo) {
              console.warn(`Failed to fetch price for ${token.symbol}:`, error);
            }
          }
        }

        setPriceData(prices);
        setLastUpdate(new Date());

        // Demonstrate quote functionality
        if (tokenSymbol && UNISWAP_TOKENS.WETH) {
          const quote = await getQuote(UNISWAP_TOKENS.WETH, UNISWAP_TOKENS.USDC, '1');
          
          if (quote?.success && showDebugInfo) {
            console.log(`💱 Uniswap Quote: 1 WETH = ${quote.quote} USDC`);
            console.log(`⛽ Estimated Gas: ${quote.gas}`);
            console.log(`📉 Price Impact: ${quote.impact}%`);
          }
        }

      } catch (error) {
        if (showDebugInfo) {
          console.error('Uniswap analytics update failed:', error);
        }
      }
    };

    // Initial fetch
    fetchPrices();
    
    // Update prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    
    return () => clearInterval(interval);
  }, [isServiceReady, tokenSymbol, showDebugInfo, getTokenPrice, getQuote]);

  // Hidden component - only logs for demonstration
  if (!showDebugInfo) {
    return null;
  }

  return (
    <div className="hidden">
      {/* This component runs Uniswap price analysis in the background */}
      <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
        <div className="font-semibold">🦄 Uniswap Analytics Active</div>
        {lastUpdate && (
          <div>Last Update: {lastUpdate.toLocaleTimeString()}</div>
        )}
        <div>Service Ready: {isServiceReady ? '✅' : '⏳'}</div>
        
        {Object.entries(priceData).map(([symbol, price]) => (
          <div key={symbol}>
            {symbol}: ${price.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UniswapAnalytics;