"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border-t border-white/5">
      <div className="flex gap-3 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your intent... e.g., 'Swap 10 SUI for USDC'"
          disabled={disabled}
          className={cn(
            "flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sui-steel placeholder:text-sui-mist focus:outline-none focus:ring-2 focus:ring-sui-blue/50 focus:border-sui-blue transition-all",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className={cn(
            "p-3 rounded-lg bg-sui-blue hover:bg-blue-500 text-white transition-all shadow-[0_0_15px_rgba(77,162,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed",
            !disabled && input.trim() && "hover:shadow-[0_0_25px_rgba(77,162,255,0.6)]"
          )}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
}
