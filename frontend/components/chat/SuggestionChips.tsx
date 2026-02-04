"use client";

interface SuggestionChipsProps {
  onSelect: (suggestion: string) => void;
}

const SUGGESTIONS = [
  "Swap 10 SUI for USDC",
  "Check my portfolio",
  "Transfer 5 SUI to 0x...",
  "Set limit order",
];

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {SUGGESTIONS.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="px-3 py-1.5 text-sm rounded-full bg-white/5 border border-white/10 text-sui-mist hover:text-white hover:border-sui-blue/50 transition-all"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
