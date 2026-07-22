"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BRAND_NAME } from "@/components/brand-name";
import { Sparkle } from "@/components/sparkle";

const PROFESSION = "orbit · chaser";

// Name and profession sit on the same 135-radius hemisphere, concentric
// with the photo — one unified circle rather than two different arcs.
// On mount, the circle (arcs + sparkles) fades in while rotating into
// place; the photo fades in on its own, slightly after.
export function ProfileCircle({ photoSrc, photoAlt }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative aspect-4/5 w-full max-w-sm shrink-0 overflow-hidden">
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          transform: revealed ? "rotate(0deg)" : "rotate(-45deg)",
          opacity: revealed ? 1 : 0,
        }}
      >
        <svg viewBox="0 0 300 375" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path id="links-name-arc" d="M 40,200 A 110,110 0 0 1 260,200" fill="none" />
          {/* Curved text on the underside of a circle leans toward the
              center (reads "closer" to the photo) while text on top leans
              away — so the profession arc sits centered a bit lower to
              land at the same apparent distance as the name arc above. */}
          <path id="links-profession-arc" d="M 40,212 A 110,110 0 0 0 260,212" fill="none" />
          <text
            className="fill-white capitalize [font-family:var(--font-hopeless-romantic)]"
            style={{ fontSize: 18, letterSpacing: 3 }}
          >
            <textPath href="#links-name-arc" startOffset="50%" textAnchor="middle">
              {BRAND_NAME}
            </textPath>
          </text>
          <text
            className="fill-white/70 font-serif uppercase"
            style={{ fontSize: 24, letterSpacing: 3 }}
          >
            <textPath href="#links-profession-arc" startOffset="50%" textAnchor="middle">
              {PROFESSION}
            </textPath>
          </text>
        </svg>

        <Sparkle className="absolute left-[10%] top-[53.33%] h-8 w-8 -translate-y-1/2 text-subcaption" />
        <Sparkle className="absolute right-[10%] top-[53.33%] h-8 w-8 -translate-y-1/2 text-subcaption" />
      </div>

      <div
        className="absolute left-1/2 top-[28%] h-[50.67%] w-[63.33%] overflow-hidden rounded-full border border-white/20 bg-white/5 transition-all duration-700 ease-out"
        style={{
          opacity: revealed ? 1 : 0,
          transform: `translateX(-50%) scale(${revealed ? 1 : 0.02})`,
          transitionDelay: "200ms",
        }}
      >
        <Image
          src={photoSrc}
          alt={photoAlt}
          fill
          sizes="(min-width: 640px) 12rem, 45vw"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
