"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaTelegram } from "react-icons/fa";
import { VscTwitter } from "react-icons/vsc";
import { Sparkle } from "@/components/sparkle";
import { cn } from "@/lib/utils";

const BIO = "日々旅にして、旅を栖とす。";

const LINKS = [
  { href: "/", label: "Website" },
  { href: "https://throne.com/claireumezawa", label: "Wishlist", external: true },
  { href: "https://t.me/+zGqchxeyVHQ4YmI1", label: "Telegram Channel", external: true },
  { href: "/blog", label: "Blog" },
];

const SOCIALS = [
  { href: "https://x.com/taleofclaire", label: "X", Icon: VscTwitter },
  { href: "https://t.me/+zGqchxeyVHQ4YmI1", label: "Telegram", Icon: FaTelegram },
];

// Starts once the ProfileCircle above has settled (~1.1s: its 1s rotate/fade
// plus a 200ms head start before the photo's own reveal). Odd items (1st,
// 3rd...) slide in from the left, even items from the right, staggered;
// the socials row slides up from below right after.
const START_DELAY_MS = 1100;
const STEP_MS = 120;
const EXIT_DURATION_MS = 450;

export function LinksList() {
  const [revealed, setRevealed] = useState(false);
  const [pickedIndex, setPickedIndex] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => setRevealed(true), START_DELAY_MS);
    return () => clearTimeout(timeout);
  }, []);

  const pick = (e, href, external, i) => {
    e.preventDefault();
    if (pickedIndex !== null) return;
    setPickedIndex(i);
    setTimeout(() => {
      if (external) {
        // Opens in a new tab — this page stays put, so bring the full list
        // back instead of leaving it stuck on just the one item.
        window.open(href, "_blank", "noopener,noreferrer");
        setPickedIndex(null);
      } else {
        router.push(href);
      }
    }, EXIT_DURATION_MS);
  };

  return (
    <>
      <p
        className=" -mt-10 max-w-xs text-center text-sm text-white/80 transition-all duration-700 ease-out"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(0.75rem)",
        }}
      >
        {BIO}
      </p>

      <div className="mt-6 flex w-full max-w-xs flex-col gap-4">
        {LINKS.map(({ href, label, external }, i) => {
          const oddItem = i % 2 === 0;
          const isPicked = pickedIndex === i;
          const isExiting = pickedIndex !== null && !isPicked;

          let transform;
          let opacity;
          let duration;
          let delay;

          if (isPicked) {
            transform = "translateX(0)";
            opacity = 1;
            duration = 700;
            delay = 0;
          } else if (isExiting) {
            transform = `translateX(${oddItem ? "-8rem" : "8rem"})`;
            opacity = 0;
            duration = EXIT_DURATION_MS;
            delay = 0;
          } else if (revealed) {
            transform = "translateX(0)";
            opacity = 1;
            duration = 700;
            delay = i * STEP_MS;
          } else {
            transform = `translateX(${oddItem ? "-2.5rem" : "2.5rem"})`;
            opacity = 0;
            duration = 700;
            delay = 0;
          }

          return (
            <div
              key={href}
              className="relative transition-all ease-out"
              style={{ opacity, transform, transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }}
            >
              {oddItem && (
                <Sparkle className="absolute -left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-subcaption" />
              )}
              <Link
                href={href}
                onClick={(e) => pick(e, href, external, i)}
                className={cn(
                  "block rounded-full py-3.5 text-center text-sm font-semibold uppercase tracking-[0.15em] text-zinc-900 no-underline shadow-md shadow-black/20 transition-transform hover:-translate-y-0.5",
                  oddItem ? "bg-white" : "bg-[#f2ece2]"
                )}
              >
                {label}
              </Link>
              {!oddItem && (
                <Sparkle className="absolute -right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-subcaption" />
              )}
            </div>
          );
        })}
      </div>

      <div
        className="mt-10 flex items-center gap-6 transition-all duration-700 ease-out"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(1.5rem)",
          transitionDelay: `${LINKS.length * STEP_MS + 100}ms`,
        }}
      >
        {SOCIALS.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-white transition-opacity hover:opacity-70"
          >
            <Icon className="h-6 w-6" />
          </a>
        ))}
      </div>
    </>
  );
}
