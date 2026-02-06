'use client';

import { useState, useEffect, useCallback } from 'react';

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  lastUpdate: number;
}

interface OrderBookData {
  bids: Array<{ price: number; quantity: number; total: number }>;
  asks: Array<{ price: number; quantity: number; total: number }>;
  spread: number;
}

interface TradeData {
  id: string;
  price: number;
  quantity: number;
  timestamp: number;
  side: 'buy' | 'sell';
}

export function useMarketData(symbol: string = 'DEEP/SUI') {
  const [marketData, setMarketData] = useState<MarketData>({
    symbol,
    price: 0.85,
    change24h: 2.34,
    high24h: 0.89,
    low24h: 0.81,
    volume24h: 2400000,
    lastUpdate: Date.now()
  });

  const [orderBook, setOrderBook] = useState<OrderBookData>({
    bids: [],
    asks: [],
    spread: 0
  });

  const [recentTrades, setRecentTrades] = useState<TradeData[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch market data from DeepBook indexer
  const fetchMarketData = useCallback(async () => {
    try {
      // TODO: Replace with actual DeepBook indexer API call
      // const response = await fetch(`${process.env.NEXT_PUBLIC_DEEPBOOK_INDEXER_URL}/api/market/${symbol}`);
      // const data = await response.json();
      
      // For now, simulate real-time updates
      setMarketData(prev => ({
        ...prev,
        price: Math.max(0.01, prev.price + (Math.random() - 0.5) * 0.01),
        change24h: prev.change24h + (Math.random() - 0.5) * 0.1,
        lastUpdate: Date.now()
      }));
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  }, [symbol]);

  // Fetch order book data
  const fetchOrderBook = useCallback(async () => {
    try {
      // TODO: Replace with actual DeepBook indexer API call
      // const response = await fetch(`${process.env.NEXT_PUBLIC_DEEPBOOK_INDEXER_URL}/api/orderbook/${symbol}`);
      // const data = await response.json();
      
      // Use current market data price without depending on it
      setMarketData(currentMarketData => {
        const basePrice = currentMarketData.price;
        const bids = Array.from({ length: 20 }, (_, i) => {
          const price = Math.max(0.001, basePrice - (i + 1) * 0.001);
          const quantity = Math.random() * 10000 + 1000;
          return { price, quantity, total: quantity * (i + 1) };
        });
        
        const asks = Array.from({ length: 20 }, (_, i) => {
          const price = basePrice + (i + 1) * 0.001;
          const quantity = Math.random() * 10000 + 1000;
          return { price, quantity, total: quantity * (i + 1) };
        });

        setOrderBook({
          bids,
          asks,
          spread: asks[0]?.price - bids[0]?.price || 0
        });
        
        return currentMarketData; // Don't update market data here
      });
    } catch (error) {
      console.error('Error fetching order book:', error);
    }
  }, [symbol]);

  // Fetch recent trades
  const fetchRecentTrades = useCallback(async () => {
    try {
      // TODO: Replace with actual DeepBook indexer API call
      // const response = await fetch(`${process.env.NEXT_PUBLIC_DEEPBOOK_INDEXER_URL}/api/trades/${symbol}?limit=50`);
      // const data = await response.json();
      
      // Use current market data price without depending on it
      setMarketData(currentMarketData => {
        const newTrade: TradeData = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          price: Math.max(0.01, currentMarketData.price + (Math.random() - 0.5) * 0.005),
          quantity: Math.random() * 5000 + 100,
          timestamp: Date.now(),
          side: Math.random() > 0.5 ? 'buy' : 'sell'
        };

        setRecentTrades(prev => [newTrade, ...prev.slice(0, 49)]);
        return currentMarketData; // Don't update market data here
      });
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  }, [symbol]);

  // WebSocket connection for real-time data
  const connectWebSocket = useCallback(() => {
    try {
      // TODO: Implement WebSocket connection to DeepBook indexer
      // const ws = new WebSocket(`${process.env.NEXT_PUBLIC_DEEPBOOK_WS_URL}/ws/market/${symbol}`);
      
      // ws.onopen = () => {
      //   setIsConnected(true);
      //   console.log('Connected to market data feed');
      // };

      // ws.onmessage = (event) => {
      //   const data = JSON.parse(event.data);
      //   if (data.type === 'price_update') {
      //     setMarketData(prev => ({ ...prev, ...data.payload }));
      //   } else if (data.type === 'orderbook_update') {
      //     setOrderBook(prev => ({ ...prev, ...data.payload }));
      //   } else if (data.type === 'trade_update') {
      //     setRecentTrades(prev => [data.payload, ...prev.slice(0, 49)]);
      //   }
      // };

      // ws.onclose = () => {
      //   setIsConnected(false);
      //   console.log('Disconnected from market data feed');
      // };

      // return ws;
      
      // Simulate connection
      setIsConnected(true);
      return null;
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      return null;
    }
  }, []); // No dependencies needed since we're just simulating connection

  // Initialize data fetching
  useEffect(() => {
    // Initial data fetch
    fetchMarketData();
    fetchOrderBook();
    fetchRecentTrades();

    // Set up intervals for polling (in case WebSocket is not available)
    const marketDataInterval = setInterval(fetchMarketData, 5000);
    const orderBookInterval = setInterval(fetchOrderBook, 2000);
    const tradesInterval = setInterval(fetchRecentTrades, 3000);

    // Connect WebSocket
    const ws = connectWebSocket();

    return () => {
      clearInterval(marketDataInterval);
      clearInterval(orderBookInterval);
      clearInterval(tradesInterval);
      if (ws) {
        ws.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]); // Only depend on symbol to prevent array size changes

  return {
    marketData,
    orderBook,
    recentTrades,
    isConnected,
    refetch: {
      marketData: fetchMarketData,
      orderBook: fetchOrderBook,
      recentTrades: fetchRecentTrades
    }
  };
}