"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { Subcaption } from "@/components/subcaption";
import { cn } from "@/lib/utils";

// Placeholder values — replace with real stats.
const STATS = [
  { label: "Height", value: "5'4\" / 162cm" },
  { label: "Age", value: "Mid 20s, body age 23" },
  { label: "Education", value: "World Top 15, BBA+MA" },
  { label: "Size", value: "US 00 / XS / スペ115" },
  { label: "Idol", value: "Akira Kurosawa" },
  { label: "Shape", value: "Slim Hourglass, Lean & Toned" },
  { label: "Hobbies", value: "SECRET. I take my hobbies seriously. ", wide: true },
  {
    label: "Topics",
    value: " Scientific & social ethics, game theory, history (never gets old, pun intended), liquors.",
    wide: true,
  },
  {
    label: "TYPE OF GUY (FAQ):",
    value: "Trustworthy (quote: 信用できる人), passionate, intelligent, a little nerdy",
    wide: true,
  },
  { label: "STYLE", value: "Elegant & classical feminine, like Tokyo Calendar Girls ", wide: true },
];

export function ModelStats() {
  const cardRef = useRef(null);
  const [cardHeight, setCardHeight] = useState(0);

  // Measures the card's real (including-padding) height instead of
  // guessing a vh value — the wrapper below needs exactly "one screen +
  // the card's own height" of scroll runway for the pin to release right
  // as the card finishes scrolling past, not before or after.
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setCardHeight(entries[0].contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    // The sticky photo below always contributes exactly its own height
    // (one screen) to this section's total scroll length as trailing dead
    // space once it releases, whether or not anything else is tuned — an
    // unavoidable side effect of "photo pinned, card scrolls over it" (the
    // photo is a normal, un-collapsed sibling box). Pulling the *next*
    // section up to compensate was tried and reverted: it pulls the footer
    // up in absolute page coordinates regardless of whether the photo has
    // actually released yet, so it can end up overlapping the photo while
    // it's still actively pinned, not just fading through its exit. Instead
    // the runway below is shrunk by REDUCED_TAIL (less than one full
    // screen), which trades a shorter gap for the photo releasing a bit
    // before the card's very last line finishes scrolling past — the card
    // just continues over the plain (already-matching-black) page
    // background for that last stretch, which reads as a fade rather than
    // a glitch, with no risk of overlapping anything after it.
    <section className="relative w-full">
      {/* Bridge/Poseidon photo — always screen-sized, and pinned in place
          (position: sticky) once it reaches the top of the viewport, for
          as long as the taller wrapper below still has runway left. Sticky
          (unlike background-attachment: fixed) works reliably on mobile. */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/images/photography/C9CECC5A-FBF5-40BF-85DE-1309CA447255-32505-000004771B7AE661_VSCO.JPG')",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Stats card — pulled up (-mt-[100vh]) to start flush with the top
          of the pinned photo; being in normal flow (not sticky itself), it
          scrolls immediately with the page while the photo behind it stays
          put, until this taller wrapper's measured (reduced) runway runs
          out. */}
      <div
        className="relative -mt-[100vh] flex flex-col items-center px-6 py-12 sm:px-16 sm:py-16"
        style={{ minHeight: `calc(70vh + ${cardHeight}px)` }}
      >
        <div
          ref={cardRef}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-10 rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-xl sm:grid-cols-2 sm:gap-16 sm:p-12"
        >
          <Reveal
            direction="left"
            className="relative aspect-2/3 w-full overflow-hidden rounded-lg border border-white/15 sm:aspect-auto sm:h-full"
          >
            <Image
              src="/images/professional/IMG_6862.jpeg"
              alt=""
              fill
              sizes="(min-width: 640px) 40vw, 90vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal direction="right">
            <h2 className="text-center text-white sm:text-left">Stats</h2>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className={cn(
                    "flex flex-col gap-1.5 text-center sm:text-left",
                    stat.wide && "col-span-2"
                  )}
                >
                  <dt>
                    <Subcaption className="text-white/70">{stat.label}</Subcaption>
                  </dt>
                  <dd>
                    <h6 className="text-white">{stat.value}</h6>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
