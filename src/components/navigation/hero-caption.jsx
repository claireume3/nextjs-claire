"use client";

import { useEffect, useState } from "react";
import { AnimatedParagraph } from "@/components/animated-paragraph";
import { BookingForm } from "@/components/booking-form";
import { BrandNameWord } from "@/components/brand-name";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";

export function HeroCaption() {
  const [scrolled, setScrolled] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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
          of one continuous string — scrolling nudges them toward each
          other, and scrolling back up lets them drift back apart. w-full
          (rather than shrinking to the widest word) is what actually gives
          self-start/self-end real distance to place them at opposite
          edges instead of just a narrow wobble. */}
      <h1 className="flex w-full flex-col text-white text-center mt-10 text-5xl sm:text-7xl lg:text-8xl">
        <BrandNameWord
          word="CLAIRE"
          className={cn(
            "self-start transition-transform duration-500 ease-out",
            scrolled ? "translate-x-5 sm:translate-x-10 lg:translate-x-16" : "translate-x-0"
          )}
        />
        <BrandNameWord
          word="UMEZAWA"
          className={cn(
            "self-end transition-transform duration-500 ease-out",
            scrolled ? "-translate-x-5 sm:-translate-x-10 lg:-translate-x-16" : "translate-x-0"
          )}
        />
      </h1>

      <AnimatedParagraph className="max-w-md text-center text-md -mt-5 text-white/80 lg:-mt-8">
        Enigmatic traveler + a nerdy streak.
      </AnimatedParagraph>

      <Button onClick={() => setBookingOpen(true)}>Meet me</Button>

      <BookingForm open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
