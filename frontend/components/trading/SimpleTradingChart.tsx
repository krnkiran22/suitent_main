'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

interface TradingChartProps {
  symbol: string;
  height?: number;
  theme?: 'light' | 'dark';
}

export default function TradingChart({ symbol, height = 400, theme = 'dark' }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0.85);
  const [priceChange, setPriceChange] = useState<number>(2.34);

  // Generate simple price data
  const generatePriceData = () => {
    const data = [];
    const now = Math.floor(Date.now() / 1000);
    let price = 0.85;
    
    // Generate 100 data points going back 5 hours (5min intervals)
    for (let i = 100; i >= 0; i--) {
      const time = now - (i * 300); // 5-minute intervals
      const change = (Math.random() - 0.5) * 0.02; // ±1% change
      price = Math.max(0.01, price + change);
      
      data.push({
        time: time,
        value: parseFloat(price.toFixed(6))
      });
    }
    
    console.log('Generated price data points:', data.length);
    setCurrentPrice(price);
    setPriceChange(((price - 0.85) / 0.85) * 100);
    
    return data;
  };

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    try {
      console.log('Creating chart...');
      
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#131722' },
          textColor: '#DDD',
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#2B2B43' },
        },
        rightPriceScale: {
          borderColor: '#485c7b',
        },
        timeScale: {
          borderColor: '#485c7b',
          timeVisible: true,
        },
        width: chartContainerRef.current.clientWidth,
        height: height - 60, // Account for header
      });

      console.log('Chart created successfully');

      // Add line series
      const lineSeries = chart.addLineSeries({
        color: '#00ff88',
        lineWidth: 2,
      });

      console.log('Line series added');

      // Generate and set initial data
      const initialData = generatePriceData();
      console.log('Generated data:', initialData.slice(0, 5)); // Log first 5 points
      
      lineSeries.setData(initialData);

      chartRef.current = chart;
      seriesRef.current = lineSeries;

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current && chart) {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };

      window.addEventListener('resize', handleResize);

      // Update data periodically
      const interval = setInterval(() => {
        try {
          const now = Math.floor(Date.now() / 1000);
          const newPrice = Math.max(0.01, currentPrice + (Math.random() - 0.5) * 0.01);
          setCurrentPrice(newPrice);
          setPriceChange(((newPrice - 0.85) / 0.85) * 100);
          
          lineSeries.update({ time: now, value: newPrice });
        } catch (error) {
          console.error('Error updating chart:', error);
        }
      }, 3000);

      return () => {
        console.log('Cleaning up chart...');
        window.removeEventListener('resize', handleResize);
        clearInterval(interval);
        chart.remove();
      };
    } catch (error) {
      console.error('Error creating chart:', error);
      
      // Fallback: show a simple price display
      if (chartContainerRef.current) {
        chartContainerRef.current.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #1e2329; color: #fff; font-family: monospace;">
            <div style="text-align: center;">
              <div style="font-size: 48px; color: #00ff88; margin-bottom: 10px;">${currentPrice.toFixed(4)}</div>
              <div style="font-size: 16px; color: #888;">DEEP/SUI Price</div>
              <div style="font-size: 14px; color: ${priceChange >= 0 ? '#00ff88' : '#ff4976'}; margin-top: 10px;">
                ${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%
              </div>
            </div>
          </div>
        `;
      }
    }
  }, [theme, height, currentPrice, priceChange]);

  return (
    <div className="w-full">
      {/* Price Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-white">{symbol}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">
              {currentPrice.toFixed(4)}
            </span>
            <span className={`text-sm px-2 py-1 rounded ${
              priceChange >= 0 ? 'text-green-400 bg-green-400/20' : 'text-red-400 bg-red-400/20'
            }`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div>24h High: <span className="text-white">{(currentPrice * 1.05).toFixed(4)}</span></div>
          <div>24h Low: <span className="text-white">{(currentPrice * 0.95).toFixed(4)}</span></div>
          <div>Volume: <span className="text-white">2.4M</span></div>
        </div>
      </div>
      
      {/* Chart Container */}
      <div 
        ref={chartContainerRef} 
        className="w-full bg-gray-800 border border-gray-700"
        style={{ height: `${height - 60}px`, minHeight: '300px' }}
      >
        {/* Loading placeholder */}
        <div className="flex items-center justify-center h-full text-gray-400">
          <div>Loading chart...</div>
        </div>
      </div>
    </div>
  );
}