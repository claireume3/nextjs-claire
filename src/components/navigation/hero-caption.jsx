"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatedParagraph } from "@/components/animated-paragraph";
import { BookingForm } from "@/components/booking-form";
import { BrandNameWord } from "@/components/brand-name";
import { Button } from "@/components/button";

// How far each word can slide, in px — scrollY is clamped to this so they
// stop moving (rather than keep sliding indefinitely) past a page's worth
// of scroll.
const MAX_SLIDE_PX = 80;

export function HeroCaption() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const claireRef = useRef(null);
  const umezawaRef = useRef(null);

  // Direct DOM writes (not React state) so this tracks every scroll pixel
  // 1:1 without a re-render — and no CSS transition on the transform,
  // since a lagging transition would fight a value that's already tied
  // directly to scroll position instead of jumping between two fixed states.
  useEffect(() => {
    const onScroll = () => {
      const offset = Math.min(window.scrollY, MAX_SLIDE_PX);
      if (claireRef.current) claireRef.current.style.transform = `translateX(${offset}px)`;
      if (umezawaRef.current) umezawaRef.current.style.transform = `translateX(${-offset}px)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = bookingOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [bookingOpen]);

  return (
    <div className="flex w-full flex-col items-center gap-3 mb-20 md:mb-0">
      {/* CLAIRE sits a line above UMEZAWA (left/right, staggered) instead
          of one continuous string — sliding toward each other by exactly
          how far the page has scrolled (clamped at MAX_SLIDE_PX), and
          drifting back apart as you scroll back up. w-full (rather than
          shrinking to the widest word) is what gives self-start/self-end
          real distance to place them at opposite edges instead of just a
          narrow wobble. */}
      <h1 className="flex w-full flex-col text-white text-center mt-10 text-5xl sm:text-7xl lg:text-8xl">
        <BrandNameWord ref={claireRef} word="CLAIRE" className="-mx-3" />
        <BrandNameWord ref={umezawaRef} word="UMEZAWA" className="pl-3" />
      </h1>

      <AnimatedParagraph className="max-w-md text-center text-md -mt-5 text-white/80 lg:-mt-8">
        Enigmatic traveler + a nerdy streak.
      </AnimatedParagraph>

      <Button onClick={() => setBookingOpen(true)}>Meet me</Button>

      <BookingForm open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
