import Link from "next/link";
import { ArrowIcon } from "@/components/arrow-icon";
import { cn } from "@/lib/utils";

// Global "view more" CTA — label on the left, arrow icon on the right. Use
// anywhere a link points to more content (galleries, blog, etc).
export function ViewMoreButton({ href, children, className, ...props }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-4 text-xs uppercase tracking-[0.12em] text-white no-underline sm:text-sm sm:tracking-[0.15em]",
        className
      )}
      {...props}
    >
      <span className="font-bold">{children}</span>
      <ArrowIcon className="h-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1 sm:h-4" />
    </Link>
  );
}
