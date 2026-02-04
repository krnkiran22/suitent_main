"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { useWallet } from "@/hooks/useWallet";
import { formatDate } from "@/lib/utils/format";
import { ExternalLink } from "lucide-react";

interface Transaction {
  id: string;
  type: "swap" | "transfer" | "mint";
  status: "success" | "failed" | "pending";
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  hash: string;
}

export default function HistoryPage() {
  const { isConnected } = useWallet();
  
  // Mock data for demonstration
  const mockTransactions: Transaction[] = [
    {
      id: "1",
      type: "swap",
      status: "success",
      from: "100 SUI",
      to: "2000 USDC",
      amount: "100",
      timestamp: Date.now() - 3600000,
      hash: "0x1234...5678",
    },
    {
      id: "2",
      type: "transfer",
      status: "success",
      from: "5 SUI",
      to: "0xabc...def",
      amount: "5",
      timestamp: Date.now() - 7200000,
      hash: "0x2345...6789",
    },
    {
      id: "3",
      type: "swap",
      status: "failed",
      from: "50 USDC",
      to: "1 SUI",
      amount: "50",
      timestamp: Date.now() - 10800000,
      hash: "0x3456...7890",
    },
  ];

  return (
    <>
      <Header />
      <PageWrapper>
        <main className="min-h-screen bg-sui-dark pt-32 pb-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Transaction History</h1>
              <p className="text-sui-mist">View all your past transactions</p>
            </div>

            {!isConnected ? (
              <div className="text-center py-20">
                <p className="text-sui-mist text-lg">
                  Please connect your wallet to view your transaction history
                </p>
              </div>
            ) : (
              <Card glass className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-white/10">
                      <tr className="text-left">
                        <th className="px-6 py-4 text-sui-mist font-medium text-sm">Type</th>
                        <th className="px-6 py-4 text-sui-mist font-medium text-sm">From</th>
                        <th className="px-6 py-4 text-sui-mist font-medium text-sm">To</th>
                        <th className="px-6 py-4 text-sui-mist font-medium text-sm">Time</th>
                        <th className="px-6 py-4 text-sui-mist font-medium text-sm">Status</th>
                        <th className="px-6 py-4 text-sui-mist font-medium text-sm">Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-white capitalize">{tx.type}</td>
                          <td className="px-6 py-4 text-sui-steel">{tx.from}</td>
                          <td className="px-6 py-4 text-sui-steel">{tx.to}</td>
                          <td className="px-6 py-4 text-sui-mist text-sm">{formatDate(tx.timestamp)}</td>
                          <td className="px-6 py-4">
                            <Badge 
                              variant={
                                tx.status === "success" ? "success" : 
                                tx.status === "failed" ? "error" : 
                                "warning"
                              }
                            >
                              {tx.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <a 
                              href={`https://suiscan.xyz/testnet/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sui-blue hover:text-blue-400 transition-colors"
                            >
                              {tx.hash}
                              <ExternalLink size={14} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </main>
      </PageWrapper>
      <Footer />
    </>
  );
}
