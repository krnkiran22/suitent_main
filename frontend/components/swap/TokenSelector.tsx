"use client";

import { useState, useRef, useEffect } from "react";
import { Token, getAllTokens } from "@/lib/tokens";
import { useClickOutside } from "@/hooks/useClickOutside";

interface TokenSelectorProps {
  selectedToken: Token;
  onSelectToken: (token: Token) => void;
  excludeToken?: Token; // Don't show this token in the list (e.g., the other selected token)
}

export function TokenSelector({ selectedToken, onSelectToken, excludeToken }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const allTokens = getAllTokens();
  const availableTokens = excludeToken
    ? allTokens.filter((t) => t.symbol !== excludeToken.symbol)
    : allTokens;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="token-selector hover:bg-gray-800 transition-colors cursor-pointer"
      >
        <img src={selectedToken.iconUrl} alt={selectedToken.symbol} className="w-6 h-6 rounded-full" />
        <span className="font-medium">{selectedToken.symbol}</span>
        <svg
          className={`w-4 h-4 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          {availableTokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => {
                onSelectToken(token);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left"
            >
              <img src={token.iconUrl} alt={token.symbol} className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <div className="font-medium text-white">{token.symbol}</div>
                <div className="text-xs text-gray-400">{token.name}</div>
              </div>
              {token.symbol === selectedToken.symbol && (
                <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
