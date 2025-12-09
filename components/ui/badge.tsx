import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "outline" | "warning";

const variantMap: Record<BadgeVariant, string> = {
  default:
    "bg-foreground/10 text-foreground dark:bg-white/20 dark:text-white border-transparent",
  outline: "border border-foreground/20 text-foreground dark:text-white",
  warning:
    "bg-amber-500/20 text-amber-900 dark:text-amber-200 border-transparent",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        variantMap[variant],
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";
