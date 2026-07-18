import Link from "next/link";
import { LuArrowRightFromLine } from "react-icons/lu";
import { cn } from "@/lib/utils";

// Global "view more" CTA — label on the left, circular icon button on the
// right. Use anywhere a link points to more content (galleries, blog, etc).
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
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 shadow-md shadow-black/30 backdrop-blur-md transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:bg-white group-hover:text-zinc-950 group-hover:shadow-lg sm:h-10 sm:w-10">
        <LuArrowRightFromLine className="h-4 w-4 sm:h-[1.1rem] sm:w-[1.1rem]" />
      </span>
    </Link>
  );
}
