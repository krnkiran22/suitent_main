"use client";

import { Message } from "@/hooks/useChat";
import { UserMessage } from "./UserMessage";
import { AIMessage } from "./AIMessage";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((message) => (
        message.type === "user" ? (
          <UserMessage key={message.id} message={message} />
        ) : (
          <AIMessage key={message.id} message={message} />
        )
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
