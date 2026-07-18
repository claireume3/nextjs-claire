import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Heading = forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "font-serif text-2xl font-semibold tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
Heading.displayName = "Heading";

export const Text = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base leading-7 text-muted-foreground", className)}
    {...props}
  />
));
Text.displayName = "Text";
