"use client";

import { useState, useCallback } from "react";

export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: number;
  action?: any; // Transaction action data
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = useCallback((message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    addMessage({ type: "user", content });

    // Simulate AI thinking
    setIsTyping(true);

    // TODO: Send to backend API for intent parsing
    // For now, simulate response
    setTimeout(() => {
      addMessage({
        type: "ai",
        content: "I understand you want to perform a transaction. Let me help you with that.",
      });
      setIsTyping(false);
    }, 1500);
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    clearMessages,
    addMessage,
  };
}
