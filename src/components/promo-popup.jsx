"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaTelegram } from "react-icons/fa";
import { BookingForm } from "@/components/booking-form";
import { Button } from "@/components/button";
import { HERO_REVEAL_MS } from "@/components/hero-background";
import { Subcaption } from "@/components/subcaption";
import { cn } from "@/lib/utils";

export function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  // Waits for the hero background to finish clearing before sliding in.
  useEffect(() => {
    const timeout = setTimeout(() => setOpen(true), HERO_REVEAL_MS);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open || bookingOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, bookingOpen]);

  const close = () => setOpen(false);

  return (
    <>
      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 bg-black/70 transition-opacity duration-500",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label="Announcement"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2.5rem)] max-w-2xl -translate-x-1/2 flex-col overflow-y-auto rounded-2xl border border-white/10 bg-black/80 shadow-2xl backdrop-blur-lg transition-all duration-700 ease-out sm:flex-row",
          open
            ? "pointer-events-auto -translate-y-1/2 opacity-100"
            : "pointer-events-none translate-y-[60vh] opacity-0"
        )}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close announcement"
          className="absolute right-5 top-5 z-10 text-xl text-white transition-opacity hover:opacity-70"
        >
          ✕
        </button>

        <div className="relative h-56 w-full shrink-0 sm:h-auto sm:w-2/5">
          <Image
            src="/images/professional/IMG_1321.jpg"
            alt=""
            fill
            sizes="(min-width: 640px) 40vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex w-full flex-col justify-center gap-4 p-8 text-center sm:w-3/5 sm:text-left">
          <Subcaption>Travel Plan</Subcaption>
          <h2 className="text-white">Rest of 2026</h2>
          <p className="text-white/70">
            US (sponsored), Singapore, Hong Kong (sponsored, almost closed
            book), and Japan.
          </p>
          <p className="text-white/70">
            Pre-screen for dates, with the exception of travel engagements,
            which can be universal.
          </p>

          <div className="mt-2 flex flex-col items-center gap-3 border-t border-white/10 pt-4 sm:items-start">
            <p className="text-white/70">
              Join my private club (telegram channel), for more inner circle moments.
            </p>
            <Button
              href="https://t.me/+zGqchxeyVHQ4YmI1"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <FaTelegram className="h-4 w-4" />
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      <BookingForm open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
