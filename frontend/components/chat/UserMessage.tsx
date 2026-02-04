"use client";

import { Message } from "@/hooks/useChat";
import { formatRelativeTime } from "@/lib/utils/format";

interface UserMessageProps {
  message: Message;
}

export function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[70%]">
        <div className="bg-white/10 rounded-2xl rounded-tr-md px-4 py-3">
          <p className="text-white text-sm">{message.content}</p>
        </div>
        <p className="text-xs text-sui-mist mt-1 text-right">
          {formatRelativeTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
