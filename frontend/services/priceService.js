// Price service to fetch current market prices
export const priceService = {
  // Mock function - replace with real API
  async getCurrentPrice(pair = 'DEEP/SUI') {
    try {
      // For demo purposes, simulate API call with random price variations
      // Replace this with actual API calls to exchanges like Binance, CoinGecko, etc.
      const basePrice = 0.7970;
      const volatility = (Math.random() - 0.5) * 0.05; // ±2.5% volatility
      const currentPrice = basePrice * (1 + volatility);
      
      return {
        success: true,
        price: currentPrice,
        timestamp: Date.now(),
        pair: pair
      };
    } catch (error) {
      console.error('Error fetching current price:', error);
      return {
        success: false,
        error: error.message,
        price: 0.7970 // Fallback price
      };
    }
  },

  // Function to fetch historical price data
  async getHistoricalPrices(pair = 'DEEP/SUI', periods = 100) {
    try {
      const basePrice = 0.7970;
      const now = Date.now();
      const historicalData = [];
      
      for (let i = periods; i >= 0; i--) {
        const timestamp = now - i * 60000; // 1 minute intervals
        const volatility = (Math.random() - 0.5) * 0.1; // ±5% volatility
        const price = basePrice * (1 + volatility);
        historicalData.push({ price, timestamp });
      }
      
      return {
        success: true,
        data: historicalData,
        pair: pair
      };
    } catch (error) {
      console.error('Error fetching historical prices:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }
};

// Real-time price monitoring
export const createPriceMonitor = (onPriceUpdate, interval = 5000) => {
  const monitor = setInterval(async () => {
    const priceData = await priceService.getCurrentPrice();
    if (priceData.success) {
      onPriceUpdate(priceData.price);
    }
  }, interval);

  return () => clearInterval(monitor);
};