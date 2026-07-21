"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowIcon } from "@/components/arrow-icon";
import { cn } from "@/lib/utils";

const EXIT_DURATION_MS = 350;

// Global "view more" CTA — label on the left, arrow icon on the right. Use
// anywhere a link points to more content (galleries, blog, etc). On click,
// the arrow swipes right and fades out before the page actually navigates.
export function ViewMoreButton({ href, children, className, ...props }) {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    if (exiting) return;
    setExiting(true);
    setTimeout(() => router.push(href), EXIT_DURATION_MS);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        "group inline-flex items-center gap-4 text-xs uppercase tracking-[0.12em] text-white no-underline sm:text-sm sm:tracking-[0.15em]",
        className
      )}
      {...props}
    >
      <span className="font-bold">{children}</span>
      <ArrowIcon
        className={cn(
          "h-3.5 transition-all ease-out group-hover:translate-x-1 sm:h-4",
          exiting ? "translate-x-6 opacity-0" : "translate-x-0 opacity-100"
        )}
        style={{ transitionDuration: exiting ? `${EXIT_DURATION_MS}ms` : "300ms" }}
      />
    </Link>
  );
}
