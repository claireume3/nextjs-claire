"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Exported so PromoPopup can wait for this to finish before it slides in.
export const HERO_REVEAL_MS = 1000;

// Starts blurred and clears to sharp on mount — this plays first, before the
// promo popup slides in. Pass `mobileSrc` to show a different photo below
// the sm breakpoint (mobile's hero is a square crop, unlike desktop's full
// screen, so a photo framed for one doesn't always suit the other).
export function HeroBackground({ src, mobileSrc, alt }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const revealClasses = cn(
    "object-cover ease-out transition-all",
    revealed ? "scale-100 opacity-100 blur-none" : "scale-105 opacity-70 blur-2xl"
  );

  return (
    <div className="absolute inset-0 bg-black">
      {mobileSrc ? (
        <>
          <Image
            src={mobileSrc}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className={cn(revealClasses, "object-top sm:hidden")}
            style={{ transitionDuration: `${HERO_REVEAL_MS}ms` }}
          />
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className={cn(revealClasses, "hidden object-center sm:block")}
            style={{ transitionDuration: `${HERO_REVEAL_MS}ms` }}
          />
        </>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className={cn(revealClasses, "object-top sm:object-center")}
          style={{ transitionDuration: `${HERO_REVEAL_MS}ms` }}
        />
      )}
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}
