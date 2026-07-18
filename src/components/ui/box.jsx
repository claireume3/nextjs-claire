import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Box = forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn(className)} {...props} />;
});
Box.displayName = "Box";
