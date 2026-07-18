import { cn } from "@/lib/utils";

// Small four-point sparkle accent — hand-drawn to match the site's other
// line-art marks (see logo.jsx), used to flank the profile photo and links
// on the /links page. Always breathes (shrink + dim, then back to full
// size) via the shared sparkle-pulse keyframes in globals.css.
export function Sparkle({ className, style, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn(className)}
      style={{ animation: "sparkle-pulse 2s ease-in-out infinite", ...style }}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2c.6 5 1.2 7.5 6 10-4.8 2.5-5.4 5-6 10-.6-5-1.2-7.5-6-10 4.8-2.5 5.4-5 6-10z" />
    </svg>
  );
}
