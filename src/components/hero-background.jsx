"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Exported so PromoPopup can wait for this to finish before it slides in.
export const HERO_REVEAL_MS = 1000;

// Starts blurred and clears to sharp on mount — this plays first, before the
// promo popup slides in.
export function HeroBackground({ src, alt }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="absolute inset-0 bg-black">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className={cn(
          "object-cover object-top ease-out sm:object-center",
          "transition-all",
          revealed ? "scale-100 opacity-100 blur-none" : "scale-105 opacity-70 blur-2xl"
        )}
        style={{ transitionDuration: `${HERO_REVEAL_MS}ms` }}
      />
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}
