"use client";

import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestionChips } from "./SuggestionChips";
import { useChat } from "@/hooks/useChat";
import { useWallet } from "@/hooks/useWallet";
import { Card } from "../common/Card";

export function ChatContainer() {
  const { messages, isTyping, sendMessage } = useChat();
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <Card className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <p className="text-sui-mist mb-4">Please connect your wallet to start trading</p>
        </div>
      </Card>
    );
  }

  return (
    <Card glass className="flex flex-col h-[600px]">
      {messages.length === 0 && (
        <div className="p-6">
          <h3 className="text-white font-semibold mb-2">Try these:</h3>
          <SuggestionChips onSelect={sendMessage} />
        </div>
      )}
      
      <MessageList messages={messages} />
      
      {isTyping && (
        <div className="px-6 pb-4">
          <TypingIndicator />
        </div>
      )}
      
      <ChatInput onSend={sendMessage} disabled={isTyping} />
    </Card>
  );
}
