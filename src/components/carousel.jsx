"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowIcon } from "@/components/arrow-icon";
import { AnimatedParagraph } from "@/components/animated-paragraph";
import { Reveal } from "@/components/reveal";
import { Sparkle } from "@/components/sparkle";
import { cn } from "@/lib/utils";

// Card width as a percent of the track — leaves (100 - ITEM_WIDTH) / 2 on
// each side for the prev/next card (image and text both) to peek in.
const ITEM_WIDTH = 82;

// Exported so the homepage can time the promo popup's entrance to start
// only after this finishes sliding up.
export const CAROUSEL_REVEAL_MS = 700;

export function Carousel({ slides }) {
  const [index, setIndex] = useState(0);
  const startX = useRef(null);
  const length = slides.length;

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

  const offset = (100 - ITEM_WIDTH) / 2 - index * ITEM_WIDTH;

  return (
    <div className="relative w-full max-w-5xl px-6 py-24 lg:px-8 lg:max-w-6xl xl:max-w-7xl">
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
            <div key={i} style={{ flex: `0 0 ${ITEM_WIDTH}%` }} className="px-1 sm:px-2">
              <div
                className={cn(
                  "flex flex-col items-center gap-6 transition-opacity duration-500 sm:gap-10",
                  slide.reverse ? "sm:flex-row-reverse" : "sm:flex-row",
                  i === index ? "opacity-100" : "opacity-30"
                )}
              >
                <div className="relative aspect-2/3 w-full max-w-xs overflow-hidden rounded-lg border border-white/15 bg-white/5 sm:w-1/2 sm:max-w-none">
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 40vw, 70vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex w-full flex-col gap-4 px-4 text-center sm:w-1/2 sm:px-0 sm:text-left">
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
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 text-white transition-opacity hover:opacity-70 sm:-left-4 sm:block"
      >
        <Reveal direction="right">
          <ArrowIcon className="h-4 w-auto -scale-x-100 " />
        </Reveal>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 text-white transition-opacity hover:opacity-70 sm:-right-4 sm:block"
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
