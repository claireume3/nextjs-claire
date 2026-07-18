import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const variantClasses = {
  default: "bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950",
  secondary: "bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50",
  outline: "border border-zinc-300 text-zinc-950 dark:border-zinc-700 dark:text-zinc-50",
};

export const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      variantClasses[variant],
      className
    )}
    {...props}
  />
));
Badge.displayName = "Badge";
