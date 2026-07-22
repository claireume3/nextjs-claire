"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowIcon } from "@/components/arrow-icon";
import { AnimatedParagraph } from "@/components/animated-paragraph";
import { Reveal } from "@/components/reveal";
import { Sparkle } from "@/components/sparkle";
import { cn } from "@/lib/utils";

// Card width as a percent of the track — leaves (100 - ITEM_WIDTH) / 2 on
// each side for the prev/next card (image and text both) to peek in. No
// peek on mobile (100%, edge to edge) — the prev/next arrows are already
// hidden there in favor of swipe, and full width matches "The Road
// Unfolds" section's own edge-to-edge column below it.
const DESKTOP_ITEM_WIDTH = 82;
const MOBILE_ITEM_WIDTH = 100;

// Exported so the homepage can time the promo popup's entrance to start
// only after this finishes sliding up.
export const CAROUSEL_REVEAL_MS = 700;

export function Carousel({ slides }) {
  const [index, setIndex] = useState(0);
  // Starts at the desktop value on both server and client (avoids a
  // hydration mismatch), then corrects itself a frame after mount if
  // we're actually on a narrow screen.
  const [itemWidth, setItemWidth] = useState(DESKTOP_ITEM_WIDTH);
  const startX = useRef(null);
  const length = slides.length;

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    const applyMatch = () => setItemWidth(mql.matches ? MOBILE_ITEM_WIDTH : DESKTOP_ITEM_WIDTH);
    const raf = requestAnimationFrame(applyMatch);
    mql.addEventListener("change", applyMatch);
    return () => {
      cancelAnimationFrame(raf);
      mql.removeEventListener("change", applyMatch);
    };
  }, []);

  const goTo = (i) => setIndex(((i % length) + length) % length);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  const onPointerDown = (e) => {
    startX.current = e.clientX;
  };

  const onPointerUp = (e) => {
    if (startX.current == null) return;
    const delta = e.clientX - startX.current;
    if (delta > 50) prev();
    else if (delta < -50) next();
    startX.current = null;
  };

  const offset = (100 - itemWidth) / 2 - index * itemWidth;

  return (
    <div className="relative mx-auto w-full max-w-5xl px-6 py-24 lg:px-8 lg:max-w-6xl xl:max-w-7xl">
      <div
        className="touch-pan-y overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div
          className="flex items-center transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${offset}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} style={{ flex: `0 0 ${itemWidth}%` }} className="px-0 sm:px-2">
              <div
                className={cn(
                  "flex flex-col items-center gap-6 transition-opacity duration-500 sm:gap-10",
                  slide.reverse ? "sm:flex-row-reverse" : "sm:flex-row",
                  i === index ? "opacity-100" : "opacity-30"
                )}
              >
                <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg border border-white/15 bg-white/5 sm:w-1/2">
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex w-full flex-col gap-4 text-center sm:w-1/2 sm:text-left">
                  <h2 className="text-white">{slide.title}</h2>
                  <AnimatedParagraph className="whitespace-pre-line text-white/80">
                    {slide.body}
                  </AnimatedParagraph>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 text-white transition-opacity hover:opacity-70 sm:left-0 sm:block"
      >
        <Reveal direction="right">
          <ArrowIcon className="h-4 w-auto -scale-x-100 " />
        </Reveal>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 text-white transition-opacity hover:opacity-70 sm:right-0 sm:block"
      >
        <Reveal direction="left">
          <ArrowIcon className="h-4 w-auto" />
        </Reveal>
      </button>

      <div className="mt-2 md:mt-16 flex items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="flex h-6 w-6 items-center justify-center"
          >
            {i === index ? (
              <Sparkle className="h-6 w-6 text-white" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-white/30 transition-colors" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
