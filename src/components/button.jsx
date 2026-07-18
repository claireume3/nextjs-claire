import Link from "next/link";
import { cn } from "@/lib/utils";

// Global CTA button — one place to change how every pill-style button on the
// site looks. `href` renders a Link, otherwise a <button> (type="button"
// unless overridden via props, e.g. type="submit").
const VARIANTS = {
  // Outlined, inverts to solid white on hover — primary CTAs (Book, View More).
  outline: " bg-white/10 backdrop-blur-md font-bold text-white hover:bg-white hover:text-zinc-950",
  // Solid white — the "confirm/continue" action (Next, Send request).
  solid: "border border-transparent font-semibold bg-white text-zinc-950 hover:opacity-90",
  // Quiet outline, no invert — secondary action (Back).
  ghost: "bg-white/10 text-white hover:border-white/60",
};

export function Button({ variant = "outline", href, className, children, ...props }) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-6 py-2.5 text-xs uppercase tracking-[0.12em] shadow-md shadow-black/30 transition-all py-2 duration-300 ease-out no-underline hover:-translate-y-0.5 hover:shadow-lg sm:px-8 sm:py-3 sm:text-sm sm:tracking-[0.15em]",
    VARIANTS[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
