"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatedParagraph } from "@/components/animated-paragraph";
import { BookingForm } from "@/components/booking-form";
import { BrandNameWord } from "@/components/brand-name";
import { Button } from "@/components/button";

// Upper ceiling on how far each word can slide, in px — the actual cap
// used is whichever is smaller between this and the real room available
// (see recalcMaxSlide), so it never pushes a word past the heading's own
// edges on narrow screens.
const MAX_SLIDE_PX = 80;

export function HeroCaption() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const headingRef = useRef(null);
  const claireRef = useRef(null);
  const umezawaRef = useRef(null);
  const maxSlideRef = useRef(0);

  // CLAIRE sits flush with the left edge, UMEZAWA flush with the right —
  // that gives each one its full (containerWidth - wordWidth) of room to
  // slide before it would reach the opposite edge. (An earlier version had
  // both words centered instead, which left only half that much margin —
  // barely enough to move before the overflow-safety cap flattened the
  // effect to nearly nothing on mobile.) Re-measured on resize since it
  // depends on real layout, not a fixed guess.
  useEffect(() => {
    const recalcMaxSlide = () => {
      const heading = headingRef.current;
      const claire = claireRef.current;
      const umezawa = umezawaRef.current;
      if (!heading || !claire || !umezawa) return;

      const containerWidth = heading.getBoundingClientRect().width;
      const widestWord = Math.max(
        claire.getBoundingClientRect().width,
        umezawa.getBoundingClientRect().width
      );
      const availableRoom = Math.max(0, containerWidth - widestWord);
      maxSlideRef.current = Math.min(MAX_SLIDE_PX, availableRoom);
    };

    recalcMaxSlide();
    window.addEventListener("resize", recalcMaxSlide);
    return () => window.removeEventListener("resize", recalcMaxSlide);
  }, []);

  // Direct DOM writes (not React state) so this tracks every scroll pixel
  // 1:1 without a re-render — and no CSS transition on the transform,
  // since a lagging transition would fight a value that's already tied
  // directly to scroll position instead of jumping between two fixed states.
  //
  // The write itself is deferred to the next animation frame (with a
  // `ticking` guard so a burst of scroll events between frames only
  // schedules one) instead of happening synchronously inside the scroll
  // handler — a fast scroll/fling can fire many more scroll events than
  // the display actually repaints, and writing on every single one causes
  // redundant style work that doesn't line up with the paint cycle, which
  // is what reads as janky/not smooth.
  useEffect(() => {
    let ticking = false;

    const applyOffset = () => {
      ticking = false;
      const offset = Math.min(window.scrollY, maxSlideRef.current);
      if (claireRef.current) claireRef.current.style.transform = `translateX(${offset}px)`;
      if (umezawaRef.current) umezawaRef.current.style.transform = `translateX(${-offset}px)`;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(applyOffset);
    };

    applyOffset();
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
      <h1
        ref={headingRef}
        className="flex w-full flex-col text-white text-center mt-10 text-5xl sm:mx-auto sm:max-w-2xl sm:text-7xl lg:max-w-3xl lg:text-8xl"
      >
        <BrandNameWord ref={claireRef} word="CLAIRE" className="self-start" />
        <BrandNameWord ref={umezawaRef} word="UMEZAWA" className="self-end" />
      </h1>

      <AnimatedParagraph className="max-w-md text-center text-md -mt-5 text-white/80 lg:-mt-8">
        Enigmatic traveler + a nerdy streak.
      </AnimatedParagraph>

      <Button onClick={() => setBookingOpen(true)}>Meet me</Button>

      <BookingForm open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
