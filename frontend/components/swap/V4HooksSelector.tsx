import React, { useState } from 'react';
import { useUniswapV4Hooks } from '@/hooks/useUniswapV4Hooks';
import { motion, AnimatePresence } from 'framer-motion';

interface V4HooksSelectorProps {
  onHookSelect?: (hookAddress: string) => void;
  className?: string;
}

/**
 * Uniswap V4 Hooks Selector Component
 * 
 * This component demonstrates the revolutionary hooks system in Uniswap V4
 * that allows custom logic execution at key points in the pool lifecycle.
 */
export function V4HooksSelector({ onHookSelect, className = '' }: V4HooksSelectorProps) {
  const { 
    availableHooks, 
    selectedHook, 
    switchHook, 
    getHookInfo,
    isServiceReady 
  } = useUniswapV4Hooks();

  const [showDetails, setShowDetails] = useState(false);

  const handleHookSelection = (hookAddress: string) => {
    switchHook(hookAddress);
    onHookSelect?.(hookAddress);
  };

  const currentHookInfo = getHookInfo(selectedHook);

  if (!isServiceReady) {
    return (
      <div className={`p-3 rounded-lg bg-gray-100 border border-gray-200 ${className}`}>
        <div className="flex items-center gap-2 text-gray-600">
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="text-sm">Loading V4 Hooks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hook Selector */}
      <div className="relative">
        <label className="block text-xs font-medium text-gray-600 mb-2">
          🎣 Uniswap V4 Hook Strategy
        </label>
        
        <div className="relative">
          <select
            value={selectedHook}
            onChange={(e) => handleHookSelection(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            {Object.entries(availableHooks).map(([key, hook]: [string, any]) => (
              <option key={key} value={hook.address}>
                {hook.description}
              </option>
            ))}
          </select>
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hook Details Toggle */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 transition-colors"
      >
        <span>View Hook Details</span>
        <motion.div
          animate={{ rotate: showDetails ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      {/* Hook Details Panel */}
      <AnimatePresence>
        {showDetails && currentHookInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-3 rounded-lg bg-blue-50 border border-blue-100"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-blue-900">
                  Selected Hook Details
                </h4>
                <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-full">
                  V4
                </span>
              </div>
              
              <div className="text-xs text-blue-700">
                <strong>Description:</strong> {currentHookInfo.description}
              </div>
              
              <div className="text-xs text-blue-700">
                <strong>Capabilities:</strong>{' '}
                {currentHookInfo.capabilities?.map((cap: string, index: number) => (
                  <span key={cap} className="inline-block mr-1">
                    <code className="px-1 py-0.5 bg-blue-200 rounded text-blue-800">
                      {cap}
                    </code>
                    {index < currentHookInfo.capabilities.length - 1 && ', '}
                  </span>
                ))}
              </div>
              
              <div className="text-xs text-blue-700">
                <strong>Gas Overhead:</strong>{' '}
                <code className="px-1 py-0.5 bg-blue-200 rounded text-blue-800">
                  {currentHookInfo.gasOverhead} gas
                </code>
              </div>
              
              <div className="text-xs text-blue-700">
                <strong>Address:</strong>{' '}
                <code className="px-1 py-0.5 bg-blue-200 rounded text-blue-800 break-all">
                  {currentHookInfo.address}
                </code>
              </div>
            </div>
            
            {/* V4 Features Badge */}
            <div className="mt-3 pt-2 border-t border-blue-200">
              <div className="flex flex-wrap gap-1">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  ⚡ Flash Accounting
                </span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  🏗️ Singleton Design
                </span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  🎣 Custom Hooks
                </span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  ⛽ 30% Gas Savings
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>Hooks Available: {Object.keys(availableHooks).length}</span>
        <span>Protocol: Uniswap V4</span>
      </div>
    </div>
  );
}

export default V4HooksSelector;