"use client";

import React, { useEffect, useState, useRef } from "react";
import { useChat } from "../sofia/hooks/useChat";
import { priceService, createPriceMonitor } from "@/services/priceService";

interface TradingChartProps {
  pair?: string;
  currentPrice?: number;
  priceHistory?: Array<{price: number, timestamp: number}>;
}

export const TradingChart: React.FC<TradingChartProps> = ({ 
  pair = "DEEP/SUI", 
  currentPrice: propCurrentPrice = 0.7970,
  priceHistory = []
}) => {
  const { 
    takeProfitLevel, 
    stopLossLevel, 
    setTakeProfitLevel, 
    setStopLossLevel, 
    updateCurrentPrice,
    currentPrice: contextCurrentPrice
  } = useChat();
  
  // Use prop price if provided, otherwise use context price
  const currentPrice = propCurrentPrice !== 0.7970 ? propCurrentPrice : contextCurrentPrice;
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<Array<{price: number, timestamp: number}>>([]);

  // Load initial chart data and start real-time price updates
  useEffect(() => {
    const loadInitialData = async () => {
      // Load historical data
      const historicalData = await priceService.getHistoricalPrices(pair, 100);
      if (historicalData.success) {
        setChartData(historicalData.data);
      }
      
      // Get current price and update context
      const currentPriceData = await priceService.getCurrentPrice(pair);
      if (currentPriceData.success) {
        updateCurrentPrice(currentPriceData.price);
      }
    };
    
    loadInitialData();
    
    // Start real-time price monitoring
    const stopMonitoring = createPriceMonitor((newPrice) => {
      updateCurrentPrice(newPrice);
      
      // Add new price point to chart
      setChartData(prev => {
        const newData = [...prev.slice(1), { price: newPrice, timestamp: Date.now() }];
        return newData;
      });
    }, 5000); // Update every 5 seconds
    
    return () => stopMonitoring();
  }, [pair, updateCurrentPrice]);

  // Check if price hits TP/SL levels with notifications
  useEffect(() => {
    if (takeProfitLevel && currentPrice >= takeProfitLevel.price) {
      console.log("🎯 Take Profit hit!");
      
      // Show notification
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(`🎯 Take Profit Hit!`, {
            body: `Price reached $${currentPrice.toFixed(4)} (target: $${takeProfitLevel.price.toFixed(4)})`,
            icon: '/favicon.ico'
          });
        }
      }
      
      setTakeProfitLevel(null);
      localStorage.removeItem('takeProfitLevel');
    }
    
    if (stopLossLevel && currentPrice <= stopLossLevel.price) {
      console.log("🛑 Stop Loss hit!");
      
      // Show notification
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(`🛑 Stop Loss Hit!`, {
            body: `Price dropped to $${currentPrice.toFixed(4)} (target: $${stopLossLevel.price.toFixed(4)})`,
            icon: '/favicon.ico'
          });
        }
      }
      
      setStopLossLevel(null);
      localStorage.removeItem('stopLossLevel');
    }
  }, [currentPrice, takeProfitLevel, stopLossLevel, setTakeProfitLevel, setStopLossLevel]);

  // Request notification permission on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  const chartHeight = 300;
  const chartWidth = 600;
  
  // Calculate price range for chart scaling
  const allPrices = [...chartData.map(d => d.price)];
  if (takeProfitLevel) allPrices.push(takeProfitLevel.price);
  if (stopLossLevel) allPrices.push(stopLossLevel.price);
  
  const minPrice = Math.min(...allPrices) * 0.95;
  const maxPrice = Math.max(...allPrices) * 1.05;
  const priceRange = maxPrice - minPrice;

  // Convert price to Y coordinate
  const priceToY = (price: number) => {
    return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  // Convert timestamp to X coordinate  
  const timestampToX = (timestamp: number) => {
    const minTime = Math.min(...chartData.map(d => d.timestamp));
    const maxTime = Math.max(...chartData.map(d => d.timestamp));
    const timeRange = maxTime - minTime;
    return ((timestamp - minTime) / timeRange) * chartWidth;
  };

  // Generate SVG path for price line
  const pricePath = chartData.map((point, index) => {
    const x = timestampToX(point.timestamp);
    const y = priceToY(point.price);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">{pair} Price Chart</h3>
        <div className="text-sm text-gray-400">
          Current: ${currentPrice.toFixed(4)}
        </div>
      </div>
      
      <div className="relative bg-gray-800 rounded-lg p-4" ref={chartRef}>
        <svg width={chartWidth} height={chartHeight} className="overflow-visible">
          {/* Price line */}
          <path
            d={pricePath}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            className="drop-shadow-sm"
          />
          
          {/* Current price line */}
          <line
            x1={0}
            y1={priceToY(currentPrice)}
            x2={chartWidth}
            y2={priceToY(currentPrice)}
            stroke="#3B82F6"
            strokeWidth="2"
            strokeDasharray="5,5"
            className="opacity-60"
          />
          
          {/* Take Profit Level */}
          {takeProfitLevel && (
            <g>
              <line
                x1={0}
                y1={priceToY(takeProfitLevel.price)}
                x2={chartWidth}
                y2={priceToY(takeProfitLevel.price)}
                stroke="#10B981"
                strokeWidth="2"
                strokeDasharray="10,5"
                className="opacity-80"
              />
              <rect
                x={chartWidth - 120}
                y={priceToY(takeProfitLevel.price) - 15}
                width={115}
                height={25}
                rx="4"
                fill="#10B981"
                fillOpacity="0.9"
              />
              <text
                x={chartWidth - 62}
                y={priceToY(takeProfitLevel.price) + 2}
                fill="white"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
              >
                TP: ${takeProfitLevel.price.toFixed(4)}
              </text>
            </g>
          )}
          
          {/* Stop Loss Level */}
          {stopLossLevel && (
            <g>
              <line
                x1={0}
                y1={priceToY(stopLossLevel.price)}
                x2={chartWidth}
                y2={priceToY(stopLossLevel.price)}
                stroke="#EF4444"
                strokeWidth="2"
                strokeDasharray="10,5"
                className="opacity-80"
              />
              <rect
                x={chartWidth - 120}
                y={priceToY(stopLossLevel.price) - 15}
                width={115}
                height={25}
                rx="4"
                fill="#EF4444"
                fillOpacity="0.9"
              />
              <text
                x={chartWidth - 62}
                y={priceToY(stopLossLevel.price) + 2}
                fill="white"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
              >
                SL: ${stopLossLevel.price.toFixed(4)}
              </text>
            </g>
          )}
          
          {/* Price labels on Y-axis */}
          {[minPrice, (minPrice + maxPrice) / 2, maxPrice].map((price, index) => (
            <g key={index}>
              <line
                x1={0}
                y1={priceToY(price)}
                x2={chartWidth}
                y2={priceToY(price)}
                stroke="#374151"
                strokeWidth="1"
                opacity="0.3"
              />
              <text
                x={10}
                y={priceToY(price) - 5}
                fill="#9CA3AF"
                fontSize="10"
              >
                ${price.toFixed(4)}
              </text>
            </g>
          ))}
        </svg>
        
        {/* Legend */}
        <div className="flex items-center space-x-6 mt-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-blue-400 opacity-60 border-dashed border border-blue-400"></div>
            <span className="text-gray-400">Current Price</span>
          </div>
          {takeProfitLevel && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-green-500 border-dashed border border-green-500"></div>
              <span className="text-green-400">Take Profit ({takeProfitLevel.percentage}%)</span>
            </div>
          )}
          {stopLossLevel && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-red-500 border-dashed border border-red-500"></div>
              <span className="text-red-400">Stop Loss ({stopLossLevel.percentage}%)</span>
            </div>
          )}
        </div>
      </div>
      
      {/* TP/SL Summary */}
      {(takeProfitLevel || stopLossLevel) && (
        <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-600">
          <h4 className="text-sm font-semibold text-white mb-2">Active Orders</h4>
          <div className="space-y-2">
            {takeProfitLevel && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-400">Take Profit:</span>
                <span className="text-white">${takeProfitLevel.price.toFixed(4)} (+{takeProfitLevel.percentage}%)</span>
              </div>
            )}
            {stopLossLevel && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-red-400">Stop Loss:</span>
                <span className="text-white">${stopLossLevel.price.toFixed(4)} (-{stopLossLevel.percentage}%)</span>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setTakeProfitLevel(null);
              setStopLossLevel(null);
              localStorage.removeItem('takeProfitLevel');
              localStorage.removeItem('stopLossLevel');
            }}
            className="mt-3 w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
          >
            Clear All Levels
          </button>
        </div>
      )}
    </div>
  );
};