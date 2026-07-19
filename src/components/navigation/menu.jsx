"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTelegram } from "react-icons/fa";
import { VscTwitter } from "react-icons/vsc";
import { ArrowIcon } from "@/components/arrow-icon";
import { BookingForm } from "@/components/booking-form";
import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const SOCIALS = [
  { href: "https://x.com/taleofclaire", label: "X", Icon: VscTwitter },
  { href: "https://t.me/+zGqchxeyVHQ4YmI1", label: "Telegram Channel", Icon: FaTelegram },
];

const LINKS = [
  { href: "/", label: "About" },
  {
    label: "Gallery",
    children: [
      { href: "/gallery/professional", label: "Professional" },
      { href: "/gallery/selfies-travel", label: "Selfies + Travel" },
    ],
  },
  { href: "/envelope", label: "Envelope" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/blog", label: "Blog" },
];

// opening: bottom item first, moving up to the top item (largest delay = top)
const ENTER_DELAYS = [
  "delay-[640ms]",
  "delay-[480ms]",
  "delay-[320ms]",
  "delay-[160ms]",
  "delay-[0ms]",
];
// closing: top item first, moving down to the bottom item (largest delay = bottom)
const EXIT_DELAYS = [
  "delay-[0ms]",
  "delay-[160ms]",
  "delay-[320ms]",
  "delay-[480ms]",
  "delay-[640ms]",
];

export function Menu({ className }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState("main");
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open || bookingOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, bookingOpen]);

  return (
    <>
      {/* bar: background, logo, divider line — sits below the slide-in panel */}
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-10 transition-all duration-500",
          scrolled
            ? "bg-black/20 shadow-lg shadow-black/20 backdrop-blur-xl"
            : "bg-transparent",
          className
        )}
      >
        <nav
          className={cn(
            "flex items-center justify-start px-6 transition-all duration-500 sm:justify-center sm:px-12",
            scrolled ? "py-2 sm:py-3 lg:py-6" : "py-3 sm:py-7 lg:py-10"
          )}
        >
          <Link
            href="/"
            aria-label="Claire Umezawa — Home"
            className="flex items-center gap-3 text-white no-underline"
          >
            <Logo
              className={cn(
                "shrink-0 transition-all duration-500",
                scrolled ? "h-7 w-7 opacity-100 sm:h-10 sm:w-10" : "h-0 w-0 opacity-0"
              )}
            />
            <span
              className={cn(
                "overflow-hidden font-serif tracking-wide whitespace-nowrap transition-all duration-500",
                scrolled ? "max-w-0 opacity-0" : "max-w-[8rem] text-xl opacity-100 sm:text-4xl"
              )}
            >
              C.U.
            </span>
          </Link>
        </nav>

        <div className={cn(" h-px bg-white/30 duration-500",
        scrolled?"mx-0":"mx-5 sm:mx-8")} />
      </div>

      {/* toggle button + label: stays above the nav slide-in panel, but below the booking form's mask */}
      <div
        className={cn(
          "fixed right-0 top-0 z-[35] flex items-center justify-center px-6 transition-all duration-500 sm:px-12",
          scrolled ? "py-2 sm:py-3 lg:py-6" : "py-3 sm:py-7 lg:py-10"
        )}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => {
            setOpen((prev) => !prev);
            setView(pathname.startsWith("/gallery") ? "gallery" : "main");
          }}
          className="flex items-center gap-2"
        >
          <span className="text-sm font-serif font-bold uppercase tracking-[0.15em] text-white md:text-base lg:text-lg">
            {open ? "Close" : "Menu"}
          </span>
          <span className="relative flex h-9 w-9 items-center justify-center">
            <span
              className={cn(
                "absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 bg-white transition-transform duration-200",
                open ? "-translate-y-1/2 rotate-45" : "-translate-y-[calc(50%+6px)]"
              )}
            />
            <span
              className={cn(
                "absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 bg-white transition-transform duration-200",
                open ? "-translate-y-1/2 -rotate-45" : "-translate-y-[calc(50%-6px)]"
              )}
            />
          </span>
        </button>
      </div>

      <div
        aria-hidden={!open}
        onClick={() => {
          setOpen(false);
          setView("main");
        }}
        className={cn(
          "fixed inset-0 z-20 bg-black/50 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <div
        inert={!open}
        className={cn(
          "fixed inset-y-0 right-0 z-30 w-full overflow-hidden transition-transform duration-800 ease-in-out sm:w-1/2 lg:w-1/3",
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        )}
      >
        <Image
          src="/images/professional/IMG_6822.jpeg"
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 h-full overflow-hidden">
          {/* main list */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out",
              view === "gallery" ? "-translate-x-full" : "translate-x-0"
            )}
          >
            {LINKS.map((link, i) =>
              link.children ? (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => setView("gallery")}
                  className={cn(
                    "font-serif text-3xl transition-all duration-300 ease-out hover:opacity-70",
                    pathname.startsWith("/gallery") ? "text-subcaption" : "text-white",
                    open
                      ? cn("translate-x-0 opacity-100", ENTER_DELAYS[i])
                      : cn("translate-x-8 opacity-0", EXIT_DELAYS[i])
                  )}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setOpen(false);
                    setView("main");
                  }}
                  className={cn(
                    "font-serif text-3xl no-underline transition-all duration-300 ease-out hover:opacity-70",
                    pathname === link.href ? "text-subcaption" : "text-white",
                    open
                      ? cn("translate-x-0 opacity-100", ENTER_DELAYS[i])
                      : cn("translate-x-8 opacity-0", EXIT_DELAYS[i])
                  )}
                >
                  {link.label}
                </Link>
              )
            )}

            <Button
              onClick={() => {
                setOpen(false);
                setView("main");
                setBookingOpen(true);
              }}
              className={cn(
                "mt-5 text-sm shadow-black/10 border border-white/10 ",
                open ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              )}
            >
              Contact
            </Button>

            <Link
              href="/links"
              onClick={() => {
                setOpen(false);
                setView("main");
              }}
              className={cn(
                "subcaption opacity-70 mt-2 flex items-center gap-2 no-underline transition-all duration-300 ease-out hover:opacity-100",
                open ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              )}
            >
              All My Links
              <ArrowIcon className="h-3" />
            </Link>

            <div
              className={cn(
                "mt-2 flex items-center gap-5 transition-all duration-300 ease-out",
                open ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              )}
            >
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white no-underline transition-opacity hover:opacity-70"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* gallery sub-menu */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out",
              view === "gallery" ? "translate-x-0" : "translate-x-full"
            )}
          >
            <button
              type="button"
              onClick={() => setView("main")}
              className="flex items-center gap-3 font-serif text-3xl text-white transition-opacity hover:opacity-70"
            >
              <span aria-hidden="true">←</span>
              Back
            </button>

            {LINKS.find((link) => link.children)?.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => {
                  setOpen(false);
                  setView("main");
                }}
                className={cn(
                  "font-serif text-3xl no-underline transition-opacity hover:opacity-70",
                  pathname === child.href ? "text-subcaption" : "text-white"
                )}
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <BookingForm open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
