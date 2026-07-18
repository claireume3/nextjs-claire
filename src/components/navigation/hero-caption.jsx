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
    <div className="flex flex-col items-center gap-3 mb-20 md:mb-0">
      <BrandName
        as="h1"
        className={cn(
          "text-white text-center transition-all duration-500 mt-10",
          scrolled ? "text-lg sm:text-6xl lg:text-7xl" : "text-xl sm:text-7xl lg:text-8xl"
        )}
      />

      <p as="p" center className="max-w-md text-md -mt-5 text-white/80 lg:-mt-8 ">
        Enigmatic traveler + a nerdy streak.
      </p>

      <Button onClick={() => setBookingOpen(true)}>Meet me</Button>

      <BookingForm open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
