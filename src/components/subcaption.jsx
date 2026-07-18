import { Sparkle } from "@/components/sparkle";
import { cn } from "@/lib/utils";

// Shared subcaption label — flanks its text with a sparkle on each side.
// Swap in for any `<small className="subcaption">...</small>` so every
// subcaption across the site gets the same treatment automatically.
//
// As a flex container, its own children ignore an ancestor's text-align
// entirely (that only worked for the plain <small> it replaced), so
// alignment has to be set here directly: centered on mobile always, then
// left-aligned from sm up to match each usage's original desktop layout.
// Pass `center` for the handful of spots (footer, hero caption) that were
// always centered, at every breakpoint, even before this component existed.
// The text wraps in a min-w-0 span so long labels break instead of
// overflowing past the shrink-0 sparkles.
export function Subcaption({ as: Component = "small", className, center = false, children, ...props }) {
  return (
    <Component
      className={cn(
        "subcaption flex items-center gap-1.5",
        center ? "justify-center" : "justify-center sm:justify-start",
        className
      )}
      {...props}
    >
      <Sparkle className="h-5 w-5 shrink-0 text-subcaption" />
      <span className="min-w-0 break-words text-center">{children}</span>
      <Sparkle className="h-5 w-5 shrink-0 -ml-1 text-subcaption" />
    </Component>
  );
}
