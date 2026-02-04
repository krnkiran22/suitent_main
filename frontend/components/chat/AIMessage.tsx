"use client";

import { Message } from "@/hooks/useChat";
import { formatRelativeTime } from "@/lib/utils/format";
import { ActionCard } from "./ActionCard";
import { Sparkles } from "lucide-react";

interface AIMessageProps {
  message: Message;
}

export function AIMessage({ message }: AIMessageProps) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[70%]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-sui-blue/20 flex items-center justify-center flex-shrink-0">
            <Sparkles size={16} className="text-sui-blue" />
          </div>
          <div className="flex-1">
            <div className="bg-transparent border border-white/10 rounded-2xl rounded-tl-md px-4 py-3">
              <p className="text-sui-steel text-sm">{message.content}</p>
            </div>
            {message.action && <ActionCard action={message.action} />}
            <p className="text-xs text-sui-mist mt-1">
              {formatRelativeTime(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
