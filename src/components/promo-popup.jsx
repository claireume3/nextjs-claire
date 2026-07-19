"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaTelegram } from "react-icons/fa";
import { AnimatedParagraph } from "@/components/animated-paragraph";
import { BookingForm } from "@/components/booking-form";
import { Button } from "@/components/button";
import { CAROUSEL_REVEAL_MS } from "@/components/carousel";
import { HERO_REVEAL_MS } from "@/components/hero-background";
import { Subcaption } from "@/components/subcaption";
import { cn } from "@/lib/utils";

// Waits for the hero background to finish clearing, then for the carousel's
// own slide-up (which starts right as the hero clears) to finish, so the
// two entrances happen in sequence instead of overlapping.
const POPUP_DELAY_MS = HERO_REVEAL_MS + CAROUSEL_REVEAL_MS;

// Matches the dialog's own "duration-700" slide-up — the paragraph text
// only starts appearing once that finishes, instead of racing it.
const DIALOG_SLIDE_MS = 700;

export function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setOpen(true), POPUP_DELAY_MS);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!open) return;
    const timeout = setTimeout(() => setContentVisible(true), DIALOG_SLIDE_MS);
    return () => clearTimeout(timeout);
  }, [open]);

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
        inert={!open}
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
            src="/images/professional/IMG_1321.JPG"
            alt=""
            fill
            sizes="(min-width: 640px) 40vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex w-full flex-col justify-center gap-4 p-8 text-center sm:w-3/5 sm:text-left">
          <Subcaption>Travel Plan</Subcaption>
          <h2 className="text-white font-normal">Rest of 2026</h2>
          <AnimatedParagraph active={contentVisible} className="text-white/80">
            US, Singapore, Hong Kong, and Japan.
          </AnimatedParagraph>
          <AnimatedParagraph active={contentVisible} className="text-white/80">
            Pre-screen for dates, with the exception of travel engagements,
            which can be universal.
          </AnimatedParagraph>

          <div className="mt-2 flex flex-col items-center gap-3 border-t border-white/10 pt-4 sm:items-start">
            <AnimatedParagraph active={contentVisible} className="text-white/80">
              Join my private club on telegram channel, for more inner circle moments.
            </AnimatedParagraph>
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
