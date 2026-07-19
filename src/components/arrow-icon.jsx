import { cn } from "@/lib/utils";

// Source is black line art on a transparent PNG (public/icons/senza-arrow.png,
// traced from a purchased EPS). Used as a CSS mask (not an <img>) so the
// icon paints in `currentColor` like a real icon font/SVG would — recolors
// via ordinary text-color classes (text-white, text-subcaption, group-hover:
// text-zinc-950, etc.) instead of baking in a fixed color.
const ASPECT_RATIO = 800 / 165;

export function ArrowIcon({ className, style, ...props }) {
  return (
    <span
      role="img"
      aria-hidden="true"
      className={cn("inline-block h-4 shrink-0 bg-current", className)}
      style={{
        aspectRatio: ASPECT_RATIO,
        WebkitMaskImage: "url(/icons/senza-arrow.png)",
        maskImage: "url(/icons/senza-arrow.png)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        ...style,
      }}
      {...props}
    />
  );
}
