"use client";

import { useEffect, useState } from "react";
import { BookingForm } from "@/components/booking-form";
import { BrandName } from "@/components/brand-name";
import { Button } from "@/components/button";
import { Subcaption } from "@/components/subcaption";
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
    <div className="flex flex-col items-center gap-6 mb-20 md:mb-0">
      <BrandName
        as="h1"
        className={cn(
          "text-white text-center transition-all duration-500 mt-60 md:mt-20",
          scrolled ? "text-2xl sm:text-6xl lg:text-7xl" : "text-4xl sm:text-7xl lg:text-8xl"
        )}
      />

      <Subcaption as="p" center className="max-w-md text-xs text-white/80 lg:-mt-8 px-6">
        Enigmatic traveler + a nerdy streak.
      </Subcaption>

      <Button onClick={() => setBookingOpen(true)}>Meet me</Button>

      <BookingForm open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
