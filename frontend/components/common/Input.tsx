import { cn } from "@/lib/utils/cn";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sui-steel placeholder:text-sui-mist focus:outline-none focus:ring-2 focus:ring-sui-blue/50 focus:border-sui-blue transition-all",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
