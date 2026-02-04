"use client";

import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { X } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/format";

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

interface OrderCardProps {
  order: Order;
  onCancel?: (orderId: string) => void;
}

export function OrderCard({ order, onCancel }: OrderCardProps) {
  const statusVariant = 
    order.status === "active" ? "warning" : 
    order.status === "filled" ? "success" : 
    "default";

  return (
    <Card glass className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant}>
            {order.status}
          </Badge>
          <span className="text-sm text-sui-mist capitalize">{order.type} Order</span>
        </div>
        {order.status === "active" && onCancel && (
          <button
            onClick={() => onCancel(order.id)}
            className="text-sui-mist hover:text-error transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sui-mist text-sm">Action:</span>
          <span className="text-white font-medium capitalize">
            {order.side} {order.fromToken}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sui-mist text-sm">Amount:</span>
          <span className="text-white">{order.amount} {order.fromToken}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sui-mist text-sm">Trigger Price:</span>
          <span className="text-white">{order.triggerPrice}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sui-mist text-sm">Created:</span>
          <span className="text-sui-mist text-sm">{formatRelativeTime(order.createdAt)}</span>
        </div>
      </div>
    </Card>
  );
}
