"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Same blur-to-clear reveal as the homepage's HeroBackground: starts
// blurred and clears on mount, instead of snapping in sharp immediately.
export function LinksBackground({ portraitSrc, landscapeSrc }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const imgClass = cn(
    "object-cover transition-all duration-1000 ease-out",
    revealed ? "scale-100 opacity-100 blur-none" : "scale-105 opacity-70 blur-2xl"
  );

  return (
    <div className="fixed inset-0 -z-10">
      <Image
        src={portraitSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className={cn(imgClass, "sm:hidden")}
      />
      <Image
        src={landscapeSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className={cn(imgClass, "hidden sm:block")}
      />
      <div className="absolute inset-0 bg-black/80" />
    </div>
  );
}
