import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "error" | "warning" | "default";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    success: "bg-success/20 text-success border-success/30",
    error: "bg-error/20 text-error border-error/30",
    warning: "bg-warning/20 text-warning border-warning/30",
    default: "bg-white/10 text-sui-steel border-white/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
