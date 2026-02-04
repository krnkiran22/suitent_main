"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!mounted) return null;

  const icons = {
    success: <CheckCircle className="text-success" size={20} />,
    error: <XCircle className="text-error" size={20} />,
    info: <AlertCircle className="text-sui-blue" size={20} />,
  };

  const colors = {
    success: "border-success/30",
    error: "border-error/30",
    info: "border-sui-blue/30",
  };

  return createPortal(
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg bg-sui-ocean/95 backdrop-blur-xl border shadow-lg min-w-[300px]",
          colors[type]
        )}
      >
        {icons[type]}
        <p className="flex-1 text-sm text-sui-steel">{message}</p>
        <button
          onClick={onClose}
          className="text-sui-mist hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>,
    document.body
  );
}
