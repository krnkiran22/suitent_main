import { cn } from "@/lib/utils/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-sui-blue hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(77,162,255,0.4)] hover:shadow-[0_0_25px_rgba(77,162,255,0.6)]",
      secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/10",
      outline: "border border-sui-blue text-sui-blue hover:bg-sui-blue/10",
      ghost: "text-sui-mist hover:text-white hover:bg-white/5",
    };
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-6 py-2.5 text-sm",
      lg: "px-8 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
