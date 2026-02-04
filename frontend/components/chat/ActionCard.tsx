"use client";

import { Button } from "../common/Button";
import { ArrowRight } from "lucide-react";

interface ActionCardProps {
  action: any;
}

export function ActionCard({ action }: ActionCardProps) {
  const handleConfirm = () => {
    // TODO: Execute transaction
    console.log("Executing action:", action);
  };

  return (
    <div className="mt-3 p-4 rounded-xl bg-sui-ocean border border-sui-blue/30">
      <h4 className="text-white font-semibold mb-3">Confirm Transaction</h4>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-sui-mist">Type:</span>
          <span className="text-white">Swap</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-sui-mist">From:</span>
          <span className="text-white">100 SUI</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-sui-mist">To:</span>
          <span className="text-white">~2000 USDC</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-sui-mist">Est. Gas:</span>
          <span className="text-white">0.01 SUI</span>
        </div>
      </div>

      <Button onClick={handleConfirm} className="w-full group">
        Confirm & Execute
        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
