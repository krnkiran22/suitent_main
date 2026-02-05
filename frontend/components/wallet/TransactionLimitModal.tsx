"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, AlertCircle } from "lucide-react";

interface TransactionLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionLimitModal({ isOpen, onClose }: TransactionLimitModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] grid place-items-center p-4">
      
      {/* BACKDROP */}
      <div 
        className="fixed inset-0 bg-[#0a0a0f]/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200" 
        onClick={onClose}
      />

      {/* MODAL CARD */}
      <div className="relative w-full max-w-[420px] bg-[#0D111C] rounded-[28px] border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Section */}
        <div className="p-6 pb-2 flex items-start justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-inner">
                    <AlertCircle className="w-6 h-6 text-red-500" strokeWidth={2.5} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide">Limit Reached</h2>
                    <p className="text-red-400 text-sm font-medium">Transaction Failed</p>
                </div>
            </div>
            <button 
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
                <X size={20} />
            </button>
        </div>

        {/* Message Body */}
        <div className="p-6 pt-4">
            <div className="bg-[#1A1515] border border-red-500/10 rounded-2xl p-5 mb-6">
                <p className="text-gray-300 text-[15px] leading-relaxed mb-3">
                    <span className="text-white font-semibold">System Notice:</span> The organization has exhausted its transaction limit for today.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                    We cannot process further requests at this moment. The limit will reset automatically at midnight UTC.
                </p>
            </div>

            {/* Close Action */}
            <button 
                onClick={onClose}
                className="w-full bg-[#1A1B23] hover:bg-[#23242F] text-white font-semibold text-lg py-3.5 rounded-xl border border-white/5 transition-all active:scale-[0.98]"
            >
                Close
            </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
