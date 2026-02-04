"use client";

import { Header } from "@/components/layout/Header";
import { SwapCard } from "@/components/swap/SwapCard";

export default function SwapPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center p-4 pt-24 bg-gradient-to-b from-gray-900 to-black">
        <SwapCard />
      </main>
    </>
  );
}
