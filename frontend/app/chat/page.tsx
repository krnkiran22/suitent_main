"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function ChatPage() {
  return (
    <>
      <Header />
      <PageWrapper>
        <main className="min-h-screen bg-sui-dark pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-3">
                AI Trading Assistant
              </h1>
              <p className="text-sui-mist">
                Describe what you want to do in plain English
              </p>
            </div>

            <ChatContainer />
          </div>
        </main>
      </PageWrapper>
      <Footer />
    </>
  );
}
