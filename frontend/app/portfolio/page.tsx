"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary";
import { TokenList } from "@/components/portfolio/TokenList";
import { useWallet } from "@/hooks/useWallet";
import { usePortfolio } from "@/hooks/usePortfolio";

export default function PortfolioPage() {
  const { isConnected } = useWallet();
  const { balances, loading } = usePortfolio();

  // Mock data for demonstration
  const mockTokens = [
    { symbol: "SUI", balance: "1000000000000", usdValue: 2500, change24h: 5.2 },
    { symbol: "USDC", balance: "5000000000", usdValue: 5000, change24h: 0.1 },
    { symbol: "WETH", balance: "2000000000", usdValue: 3800, change24h: -2.1 },
  ];

  return (
    <>
      <Header />
      <PageWrapper>
        <main className="min-h-screen bg-sui-dark pt-32 pb-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Portfolio</h1>
              <p className="text-sui-mist">Track your assets on Sui</p>
            </div>

            {!isConnected ? (
              <div className="text-center py-20">
                <p className="text-sui-mist text-lg">
                  Please connect your wallet to view your portfolio
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <PortfolioSummary totalValue={11300} change24h={3.8} />
                <TokenList tokens={mockTokens} loading={loading} />
              </div>
            )}
          </div>
        </main>
      </PageWrapper>
      <Footer />
    </>
  );
}
