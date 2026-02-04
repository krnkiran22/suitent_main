import { cn } from "@/lib/utils/cn";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ className, glass = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border transition-all",
        glass
          ? "bg-white/5 backdrop-blur-xl border-white/10"
          : "bg-sui-ocean border-sui-blue/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
