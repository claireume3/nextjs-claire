"use client";

import { useEffect, useState } from "react";
import { BookingForm } from "@/components/booking-form";
import { Menu } from "@/components/navigation/menu";
import { Subcaption } from "@/components/subcaption";
import { cn } from "@/lib/utils";

// Placeholder rates — replace with real figures.
// SG/US/HK/UK share the same duration tiers, so each region only needs to
// list prices (parallel to DURATIONS) — one place to update the tiers.
const DURATIONS = [
  { duration: "Up to 2 Hours", desc: "Two outfits, one location", group: "shorter" },
  {
    duration: "3 Hours",
    desc: "Multiple outfits, on-location",
    group: "shorter",
  },
  {
    duration: "4 Hours",
    desc: "Multiple outfits, multiple locations",
    group: "shorter",
  },
  {
    duration: "5 Hours",
    desc: "Frequently booked, hence added this new duration",
    group: "shorter",
  },
  {
    duration: "6 Hours",
    desc: "Multiple outfits, multiple locations",
    group: "shorter",
  },
  {
    duration: "8 Hours",
    desc: "Multiple outfits, multiple locations",
    group: "shorter",
  },
  {
    duration: "12 Hours",
    desc: "Multiple outfits, multiple locations",
    group: "longer",
  },
  {
    duration: "14 Hours",
    desc: "Multiple outfits, multiple locations",
    group: "longer",
  },
  {
    duration: "18 Hours",
    desc: "Multiple outfits, multiple locations",
    group: "longer",
  },
  {
    duration: "Whole Day",
    desc: "Multiple outfits, multiple locations",
    group: "longer",
  },
  {
    duration: "Weekend",
    desc: "Multiple outfits, multiple locations",
    group: "longer",
  },
  {
    duration: "> Three Days",
    desc: "Multiple outfits, multiple locations",
    group: "longer",
  },
];
// Only Singapore shows the session-only/travel caveat — omitted for US/HK/UK.
const STANDARD_NOTE = "Session-only. Travel & accommodation billed separately.";

const STANDARD_REGIONS = [
  {
    key: "SG",
    label: "Singapore",
    note: STANDARD_NOTE,
    prices: ["S$500", "S$900", "S$1,600", "S$2,200", "S$2,800"],
  },
  {
    key: "US",
    label: "United States",
    prices: ["$400", "$700", "$1,200", "$1,600", "$2,000"],
  },
  {
    key: "HK",
    label: "Hong Kong",
    prices: ["HK$3,000", "HK$5,400", "HK$9,500", "HK$12,000", "HK$16,500"],
  },
  {
    key: "UK",
    label: "United Kingdom",
    prices: ["£350", "£620", "£1,050", "£1,400", "£1,800"],
  },
];

const REGIONS = [
  ...STANDARD_REGIONS.map((region) => ({
    key: region.key,
    label: region.label,
    note: region.note,
    rates: DURATIONS.map((tier, i) => ({ ...tier, price: region.prices[i] })),
  })),
  {
    key: "PRIVATE",
    label: "Private",
    note: "By inquiry only. Full discretion and priority scheduling.",
    rates: [
      {
        duration: "Half Day (4 hrs)",
        desc: "Private session, single location",
        price: "$2,500",
        group: "shorter",
      },
      {
        duration: "Full Day (8 hrs)",
        desc: "Private session, multiple looks",
        price: "$4,500",
        group: "longer",
      },
      {
        duration: "Multi-Day (per day, 2+ days)",
        desc: "Extended, discreet availability",
        price: "$3,800 / day",
        group: "longer",
      },
    ],
  },
];

// Remounts (via the caller's `key`) only when its own value changes, so a
// tab switch only animates the text that actually differs between regions —
// everything else (box chrome, unchanged duration labels) stays put.
function FadeIn({ children }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span
      className={cn(
        "inline-block transition-all duration-300 ease-out",
        visible ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
      )}
    >
      {children}
    </span>
  );
}

function RateSection({ title, rates }) {
  if (!rates.length) return null;

  return (
    <div>
      <Subcaption>{title}</Subcaption>
      <dl className="mt-3 flex flex-col divide-y divide-white/10 border-t border-white/10">
        {rates.map((rate) => (
          <div
            key={rate.duration}
            className="flex items-center justify-between gap-4 py-2"
          >
            <dt className="text-white font-bold text-md md:text-lg">
              <FadeIn key={rate.duration}>{rate.duration}</FadeIn>
              {rate.desc && (
                <span className=" block">
                  <FadeIn key={rate.desc}>
                    <span className=" text-sm text-white/60">{rate.desc}</span>
                  </FadeIn>
                </span>
              )}
            </dt>
            <dd className="text-white font-bold text-lg md:text-xl">
              <FadeIn key={rate.price}>{rate.price}</FadeIn>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function RateBox({ region }) {
  const shorter = region.rates.filter((r) => r.group === "shorter");
  const longer = region.rates.filter((r) => r.group === "longer");

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10">
      <h3 className="text-white">
        <FadeIn key={region.label}>{region.label}</FadeIn>
      </h3>
      {region.note && (
        <p className="mt-1">
          <FadeIn key={region.note}>{region.note}</FadeIn>
        </p>
      )}

      <div className="mt-6 flex flex-col gap-8">
        <RateSection title="Cocktail et repas" rates={shorter} />
        <RateSection title="Romance prolongée" rates={longer} />
      </div>
    </div>
  );
}

export default function EnvelopePage() {
  const [activeRegion, setActiveRegion] = useState(REGIONS[0].key);
  const [bookingOpen, setBookingOpen] = useState(false);

  const region = REGIONS.find((r) => r.key === activeRegion);

  return (
    <>
      <Menu />
      <section className="relative isolate w-full overflow-hidden px-6 pb-20 pt-28 sm:px-16 sm:pt-36">
        <div
          className="absolute inset-0 -z-10 bg-fixed bg-cover bg-top"
          style={{
            backgroundImage: "url('/images/professional/IMG_6778.jpeg')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-black/60" />

        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-white">Envelope</h1>
          <p className="mx-auto mt-3 max-w-lg">
            Rates for studio, editorial, and travel bookings. Select a region to
            view rates — custom packages available on request.
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2">
          {REGIONS.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setActiveRegion(r.key)}
              aria-pressed={activeRegion === r.key}
              className={cn(
                "rounded-full border px-5 py-2 uppercase tracking-[0.1em] transition-colors",
                activeRegion === r.key
                  ? "border-white bg-white text-zinc-950"
                  : "border-white/25 text-white hover:border-white/50"
              )}
            >
              {r.key}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          <RateBox region={region} />
        </div>

        <div className="mx-auto mt-14 flex max-w-3xl flex-col items-center gap-4 border-t border-white/20 pt-10 text-center">
          <p className="max-w-md text-white/80">
            My deposit policy depends on the situation. As most of my schedule
            is reserved for very frequent returning ones, we&apos;ve each
            settled into our own way of arranging things.
          </p>
          
        </div>
      </section>

      <BookingForm open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
