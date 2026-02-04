"use client";

import { OrderCard } from "./OrderCard";
import { Card } from "../common/Card";

interface Order {
  id: string;
  type: "limit" | "stop";
  side: "buy" | "sell";
  fromToken: string;
  toToken: string;
  amount: string;
  triggerPrice: string;
  status: "active" | "filled" | "cancelled";
  createdAt: number;
}

interface OrdersListProps {
  orders: Order[];
  onCancel?: (orderId: string) => void;
}

export function OrdersList({ orders, onCancel }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <Card glass className="p-12 text-center">
        <p className="text-sui-mist">No active orders</p>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onCancel={onCancel} />
      ))}
    </div>
  );
}
