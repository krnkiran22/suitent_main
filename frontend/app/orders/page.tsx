"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { OrdersList } from "@/components/orders/OrdersList";
import { useWallet } from "@/hooks/useWallet";
import { useState } from "react";

export default function OrdersPage() {
  const { isConnected } = useWallet();
  
  // Mock data for demonstration
  const [mockOrders, setMockOrders] = useState([
    {
      id: "1",
      type: "limit" as const,
      side: "buy" as const,
      fromToken: "SUI",
      toToken: "USDC",
      amount: "100",
      triggerPrice: "$2.10",
      status: "active" as "active" | "cancelled",
      createdAt: Date.now() - 3600000,
    },
    {
      id: "2",
      type: "stop" as const,
      side: "sell" as const,
      fromToken: "USDC",
      toToken: "SUI",
      amount: "500",
      triggerPrice: "$2.50",
      status: "active" as "active" | "cancelled",
      createdAt: Date.now() - 7200000,
    },
  ]);

  const handleCancelOrder = (orderId: string) => {
    setMockOrders((orders) =>
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "cancelled" as const } : order
      )
    );
  };

  return (
    <>
      <Header />
      <PageWrapper>
        <main className="min-h-screen bg-sui-dark pt-32 pb-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Conditional Orders</h1>
              <p className="text-sui-mist">Manage your limit and stop orders</p>
            </div>

            {!isConnected ? (
              <div className="text-center py-20">
                <p className="text-sui-mist text-lg">
                  Please connect your wallet to view your orders
                </p>
              </div>
            ) : (
              <OrdersList 
                orders={mockOrders.filter((o) => o.status === "active")} 
                onCancel={handleCancelOrder}
              />
            )}
          </div>
        </main>
      </PageWrapper>
      <Footer />
    </>
  );
}
