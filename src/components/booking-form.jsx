"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatedParagraph } from "@/components/animated-paragraph";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";

const STEPS = 3;

// Matches the dialog's own transform/opacity transition (see the
// `style={{ transition: ... }}` below) — the intro paragraph only starts
// appearing once that finishes, instead of racing it.
const DIALOG_SLIDE_MS = 500;

const DURATIONS = ["30 minutes", "1 hour", "2 hours", "Half day", "Full day"];
const CONTACT_METHODS = [
  { key: "Email", placeholder: "you@example.com" },
  { key: "Telegram", placeholder: "@username" },
  { key: "WhatsApp", placeholder: "+1 234 567 8900" },
];
const TRAVEL_LOCATIONS = ["US", "UK", "SG", "HK"];

// Full country name (A-Z) + international dial code, used for the WhatsApp
// contact field so a number can be entered as country + local number
// instead of one free-text field.
const COUNTRY_CODES = [
  { name: "Afghanistan", dial: "+93" },
  { name: "Albania", dial: "+355" },
  { name: "Algeria", dial: "+213" },
  { name: "Andorra", dial: "+376" },
  { name: "Angola", dial: "+244" },
  { name: "Antigua and Barbuda", dial: "+1268" },
  { name: "Argentina", dial: "+54" },
  { name: "Armenia", dial: "+374" },
  { name: "Australia", dial: "+61" },
  { name: "Austria", dial: "+43" },
  { name: "Azerbaijan", dial: "+994" },
  { name: "Bahamas", dial: "+1242" },
  { name: "Bahrain", dial: "+973" },
  { name: "Bangladesh", dial: "+880" },
  { name: "Barbados", dial: "+1246" },
  { name: "Belarus", dial: "+375" },
  { name: "Belgium", dial: "+32" },
  { name: "Belize", dial: "+501" },
  { name: "Benin", dial: "+229" },
  { name: "Bhutan", dial: "+975" },
  { name: "Bolivia", dial: "+591" },
  { name: "Bosnia and Herzegovina", dial: "+387" },
  { name: "Botswana", dial: "+267" },
  { name: "Brazil", dial: "+55" },
  { name: "Brunei", dial: "+673" },
  { name: "Bulgaria", dial: "+359" },
  { name: "Burkina Faso", dial: "+226" },
  { name: "Burundi", dial: "+257" },
  { name: "Cabo Verde", dial: "+238" },
  { name: "Cambodia", dial: "+855" },
  { name: "Cameroon", dial: "+237" },
  { name: "Canada", dial: "+1" },
  { name: "Central African Republic", dial: "+236" },
  { name: "Chad", dial: "+235" },
  { name: "Chile", dial: "+56" },
  { name: "China", dial: "+86" },
  { name: "Colombia", dial: "+57" },
  { name: "Comoros", dial: "+269" },
  { name: "Congo (DRC)", dial: "+243" },
  { name: "Congo (Republic)", dial: "+242" },
  { name: "Costa Rica", dial: "+506" },
  { name: "Croatia", dial: "+385" },
  { name: "Cuba", dial: "+53" },
  { name: "Cyprus", dial: "+357" },
  { name: "Czechia", dial: "+420" },
  { name: "Denmark", dial: "+45" },
  { name: "Djibouti", dial: "+253" },
  { name: "Dominica", dial: "+1767" },
  { name: "Dominican Republic", dial: "+1809" },
  { name: "Ecuador", dial: "+593" },
  { name: "Egypt", dial: "+20" },
  { name: "El Salvador", dial: "+503" },
  { name: "Equatorial Guinea", dial: "+240" },
  { name: "Eritrea", dial: "+291" },
  { name: "Estonia", dial: "+372" },
  { name: "Eswatini", dial: "+268" },
  { name: "Ethiopia", dial: "+251" },
  { name: "Fiji", dial: "+679" },
  { name: "Finland", dial: "+358" },
  { name: "France", dial: "+33" },
  { name: "Gabon", dial: "+241" },
  { name: "Gambia", dial: "+220" },
  { name: "Georgia", dial: "+995" },
  { name: "Germany", dial: "+49" },
  { name: "Ghana", dial: "+233" },
  { name: "Greece", dial: "+30" },
  { name: "Grenada", dial: "+1473" },
  { name: "Guatemala", dial: "+502" },
  { name: "Guinea", dial: "+224" },
  { name: "Guinea-Bissau", dial: "+245" },
  { name: "Guyana", dial: "+592" },
  { name: "Haiti", dial: "+509" },
  { name: "Honduras", dial: "+504" },
  { name: "Hungary", dial: "+36" },
  { name: "Iceland", dial: "+354" },
  { name: "India", dial: "+91" },
  { name: "Indonesia", dial: "+62" },
  { name: "Iran", dial: "+98" },
  { name: "Iraq", dial: "+964" },
  { name: "Ireland", dial: "+353" },
  { name: "Israel", dial: "+972" },
  { name: "Italy", dial: "+39" },
  { name: "Jamaica", dial: "+1876" },
  { name: "Japan", dial: "+81" },
  { name: "Jordan", dial: "+962" },
  { name: "Kazakhstan", dial: "+7" },
  { name: "Kenya", dial: "+254" },
  { name: "Kiribati", dial: "+686" },
  { name: "Kosovo", dial: "+383" },
  { name: "Kuwait", dial: "+965" },
  { name: "Kyrgyzstan", dial: "+996" },
  { name: "Laos", dial: "+856" },
  { name: "Latvia", dial: "+371" },
  { name: "Lebanon", dial: "+961" },
  { name: "Lesotho", dial: "+266" },
  { name: "Liberia", dial: "+231" },
  { name: "Libya", dial: "+218" },
  { name: "Liechtenstein", dial: "+423" },
  { name: "Lithuania", dial: "+370" },
  { name: "Luxembourg", dial: "+352" },
  { name: "Madagascar", dial: "+261" },
  { name: "Malawi", dial: "+265" },
  { name: "Malaysia", dial: "+60" },
  { name: "Maldives", dial: "+960" },
  { name: "Mali", dial: "+223" },
  { name: "Malta", dial: "+356" },
  { name: "Marshall Islands", dial: "+692" },
  { name: "Mauritania", dial: "+222" },
  { name: "Mauritius", dial: "+230" },
  { name: "Mexico", dial: "+52" },
  { name: "Micronesia", dial: "+691" },
  { name: "Moldova", dial: "+373" },
  { name: "Monaco", dial: "+377" },
  { name: "Mongolia", dial: "+976" },
  { name: "Montenegro", dial: "+382" },
  { name: "Morocco", dial: "+212" },
  { name: "Mozambique", dial: "+258" },
  { name: "Myanmar", dial: "+95" },
  { name: "Namibia", dial: "+264" },
  { name: "Nauru", dial: "+674" },
  { name: "Nepal", dial: "+977" },
  { name: "Netherlands", dial: "+31" },
  { name: "New Zealand", dial: "+64" },
  { name: "Nicaragua", dial: "+505" },
  { name: "Niger", dial: "+227" },
  { name: "Nigeria", dial: "+234" },
  { name: "North Korea", dial: "+850" },
  { name: "North Macedonia", dial: "+389" },
  { name: "Norway", dial: "+47" },
  { name: "Oman", dial: "+968" },
  { name: "Pakistan", dial: "+92" },
  { name: "Palau", dial: "+680" },
  { name: "Panama", dial: "+507" },
  { name: "Papua New Guinea", dial: "+675" },
  { name: "Paraguay", dial: "+595" },
  { name: "Peru", dial: "+51" },
  { name: "Philippines", dial: "+63" },
  { name: "Poland", dial: "+48" },
  { name: "Portugal", dial: "+351" },
  { name: "Qatar", dial: "+974" },
  { name: "Romania", dial: "+40" },
  { name: "Russia", dial: "+7" },
  { name: "Rwanda", dial: "+250" },
  { name: "Saint Kitts and Nevis", dial: "+1869" },
  { name: "Saint Lucia", dial: "+1758" },
  { name: "Saint Vincent and the Grenadines", dial: "+1784" },
  { name: "Samoa", dial: "+685" },
  { name: "San Marino", dial: "+378" },
  { name: "Sao Tome and Principe", dial: "+239" },
  { name: "Saudi Arabia", dial: "+966" },
  { name: "Senegal", dial: "+221" },
  { name: "Serbia", dial: "+381" },
  { name: "Seychelles", dial: "+248" },
  { name: "Sierra Leone", dial: "+232" },
  { name: "Singapore", dial: "+65" },
  { name: "Slovakia", dial: "+421" },
  { name: "Slovenia", dial: "+386" },
  { name: "Solomon Islands", dial: "+677" },
  { name: "Somalia", dial: "+252" },
  { name: "South Africa", dial: "+27" },
  { name: "South Korea", dial: "+82" },
  { name: "South Sudan", dial: "+211" },
  { name: "Spain", dial: "+34" },
  { name: "Sri Lanka", dial: "+94" },
  { name: "Sudan", dial: "+249" },
  { name: "Suriname", dial: "+597" },
  { name: "Sweden", dial: "+46" },
  { name: "Switzerland", dial: "+41" },
  { name: "Syria", dial: "+963" },
  { name: "Taiwan", dial: "+886" },
  { name: "Tajikistan", dial: "+992" },
  { name: "Tanzania", dial: "+255" },
  { name: "Thailand", dial: "+66" },
  { name: "Timor-Leste", dial: "+670" },
  { name: "Togo", dial: "+228" },
  { name: "Tonga", dial: "+676" },
  { name: "Trinidad and Tobago", dial: "+1868" },
  { name: "Tunisia", dial: "+216" },
  { name: "Turkey", dial: "+90" },
  { name: "Turkmenistan", dial: "+993" },
  { name: "Tuvalu", dial: "+688" },
  { name: "Uganda", dial: "+256" },
  { name: "Ukraine", dial: "+380" },
  { name: "United Arab Emirates", dial: "+971" },
  { name: "United Kingdom", dial: "+44" },
  { name: "United States", dial: "+1" },
  { name: "Uruguay", dial: "+598" },
  { name: "Uzbekistan", dial: "+998" },
  { name: "Vanuatu", dial: "+678" },
  { name: "Vatican City", dial: "+379" },
  { name: "Venezuela", dial: "+58" },
  { name: "Vietnam", dial: "+84" },
  { name: "Yemen", dial: "+967" },
  { name: "Zambia", dial: "+260" },
  { name: "Zimbabwe", dial: "+263" },
];

const DEFAULT_COUNTRY = "United States";

// Several countries share a dial code (US/Canada are both +1), so the
// select's value has to be the unique country name, not the code —
// this looks the actual code back up from that name when needed.
function dialCodeForCountry(name) {
  return COUNTRY_CODES.find((c) => c.name === name)?.dial || "";
}

const INITIAL_DATA = {
  firstName: "",
  lastName: "",
  nationality: "",
  age: "",
  linkedin: "",
  serviceType: "",
  duration: "",
  date: "",
  time: "",
  contactMethod: "",
  contactValue: "",
  country: "",
  selfIntro: "",
  wish: "",
  material: null,
  agreedToTerms: false,
};

const INITIAL_TRAVEL_DATA = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
  linkedin: "",
  idDocument: null,
  locations: [],
};

function Field({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="capitalise font-semibold text-white/60">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClasses =
  "h-9 rounded-md mb-2  bg-white/10 px-3 text-white outline-none transition-colors focus:border-white/50";

function Pill({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-4 py-2 transition-colors",
        selected
          ? "border-white bg-white text-zinc-950"
          : "border-white/25 text-white hover:border-white/50"
      )}
    >
      {children}
    </button>
  );
}

// WhatsApp needs a country code ahead of the number — a select of every
// country's full name (A-Z) paired with its dial code, plus the number
// itself as a second field, instead of one free-text input.
function WhatsAppFields({ country, value, onCountryChange, onValueChange }) {
  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      <select
        aria-label="Country"
        value={country}
        onChange={(e) => onCountryChange(e.target.value)}
        className={cn(inputClasses, "min-w-0")}
      >
        <option value="" disabled>
          Country
        </option>
        {COUNTRY_CODES.map(({ name, dial }) => (
          <option key={name} value={name}>
            {name} ({dial})
          </option>
        ))}
      </select>
      <input
        type="tel"
        placeholder="234 567 8900"
        aria-label="WhatsApp number"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={inputClasses}
      />
    </div>
  );
}

// Remounts (via the caller's `key`) each time the intro view appears —
// including when returning to it — so it starts blurred and clears on
// every entrance rather than only once.
function BlurInImage({ src }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <Image
      src={src}
      alt=""
      fill
      sizes="(min-width: 640px) 32rem, 100vw"
      className={cn(
        "object-cover transition-all duration-700 ease-out",
        revealed ? "scale-100 blur-none" : "scale-105 blur-xl"
      )}
    />
  );
}

function ProgressBar({ step }) {
  return (
    <div className="mt-8 flex gap-2">
      {Array.from({ length: STEPS }, (_, i) => (
        <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
          <div
            className={cn(
              "h-full rounded-full bg-white transition-all duration-500 ease-out",
              i < step ? "w-full" : "w-0"
            )}
          />
        </div>
      ))}
    </div>
  );
}

// Only ever mounts the current step's fields (so native `required`
// validation only ever applies to what's visible). Animates in on mount:
// slides from the right when moving forward, from the left when moving back.
function AnimatedStep({ contentRef, direction, children }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={contentRef}
      className={cn(
        "flex flex-col gap-4 transition-all duration-500 ease-in-out",
        entered
          ? "translate-x-0 opacity-100"
          : direction === "back"
            ? "-translate-x-10 opacity-0"
            : "translate-x-10 opacity-0"
      )}
    >
      {children}
    </div>
  );
}

export function BookingForm({ open, onClose }) {
  const [view, setView] = useState("intro"); // intro | booking | travel
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState("forward");
  const [data, setData] = useState(INITIAL_DATA);
  const [durationOpen, setDurationOpen] = useState(false);
  const [containerHeight, setContainerHeight] = useState(null);
  const [status, setStatus] = useState("idle");
  const [travelData, setTravelData] = useState(INITIAL_TRAVEL_DATA);
  const [travelStatus, setTravelStatus] = useState("idle");
  const [travelSubView, setTravelSubView] = useState("intro"); // intro | apply | reveal
  const [revealToken, setRevealToken] = useState("");
  const [revealStatus, setRevealStatus] = useState("idle"); // idle | checking | success | error
  const [revealSections, setRevealSections] = useState([]);
  const [contentVisible, setContentVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef(null);

  // Portalled straight to <body> — this gets rendered from several spots
  // (hero caption, menu, promo popup, envelope page), some of which sit
  // inside a position: sticky ancestor. Sticky always creates its own
  // stacking context, which traps this modal's z-40/z-50 below later
  // sibling sections instead of above everything, no matter how high the
  // z-index is set. Rendering into body sidesteps that entirely.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!open) return;
    const timeout = setTimeout(() => setContentVisible(true), DIALOG_SLIDE_MS);
    return () => clearTimeout(timeout);
  }, [open]);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setContainerHeight(el.offsetHeight);
    const ro = new ResizeObserver((entries) => {
      setContainerHeight(entries[0].contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [view, step, travelSubView]);

  const goNext = () => {
    setDirection("forward");
    setStep((prev) => prev + 1);
  };

  const goBack = () => {
    setDirection("back");
    setStep((prev) => prev - 1);
  };

  const goToBooking = () => setView("booking");
  const goToTravel = () => {
    setDirection("forward");
    setView("travel");
    setTravelSubView("intro");
  };
  const backToIntro = () => setView("intro");

  const goToTravelApply = () => {
    setDirection("forward");
    setTravelSubView("apply");
  };
  const goToTravelReveal = () => {
    setDirection("forward");
    setTravelSubView("reveal");
  };
  const backToTravelIntro = () => {
    setDirection("back");
    setTravelSubView("intro");
    setRevealStatus("idle");
    setRevealToken("");
    setRevealSections([]);
  };

  const update = (field, value) => setData((prev) => ({ ...prev, [field]: value }));
  const updateTravel = (field, value) => setTravelData((prev) => ({ ...prev, [field]: value }));

  const selectContactMethod = (key) =>
    setData((prev) => ({
      ...prev,
      contactMethod: key,
      contactValue: "",
      country: key === "WhatsApp" ? DEFAULT_COUNTRY : "",
    }));


  const toggleLocation = (loc) =>
    setTravelData((prev) => ({
      ...prev,
      locations: prev.locations.includes(loc)
        ? prev.locations.filter((l) => l !== loc)
        : [...prev.locations, loc],
    }));

  const resetAndClose = () => {
    onClose();
    setView("intro");
    setStep(1);
    setDirection("forward");
    setData(INITIAL_DATA);
    setDurationOpen(false);
    setStatus("idle");
    setTravelData(INITIAL_TRAVEL_DATA);
    setTravelStatus("idle");
    setTravelSubView("intro");
    setRevealToken("");
    setRevealStatus("idle");
    setRevealSections([]);
    setContentVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      // WhatsApp splits into a country-code select + number field in the UI —
      // folded back into one contactValue string here so the API (and the
      // resulting email) only ever sees a single contact value, same as
      // Email/Telegram.
      const contactValue =
        data.contactMethod === "WhatsApp"
          ? `${dialCodeForCountry(data.country)} ${data.contactValue}`.trim()
          : data.contactValue;

      // FormData (not JSON) since `material` may be a File.
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "material") {
          if (value) formData.append("material", value);
        } else if (key === "country") {
          // folded into contactValue above, not sent on its own
        } else if (key === "contactValue") {
          formData.append("contactValue", contactValue);
        } else {
          formData.append(key, value);
        }
      });
      formData.append("formType", "booking");

      const res = await fetch("/api/book", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Request failed");
      resetAndClose();
    } catch {
      setStatus("error");
    }
  };

  const handleTravelSubmit = async (e) => {
    e.preventDefault();
    setTravelStatus("submitting");
    try {
      // FormData (not JSON) since `idDocument` may be a File.
      const formData = new FormData();
      Object.entries(travelData).forEach(([key, value]) => {
        if (key === "idDocument") {
          if (value) formData.append("idDocument", value);
        } else if (key === "locations") {
          value.forEach((loc) => formData.append("locations", loc));
        } else {
          formData.append(key, value);
        }
      });
      formData.append("formType", "travel-interest");

      const res = await fetch("/api/book", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Request failed");
      resetAndClose();
    } catch {
      setTravelStatus("error");
    }
  };

  const handleRevealSubmit = async (e) => {
    e.preventDefault();
    setRevealStatus("checking");
    try {
      const res = await fetch("/api/travel-token/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: revealToken.trim() }),
      });
      const json = await res.json();
      if (!res.ok || !json.valid) {
        setRevealStatus("error");
        return;
      }
      setRevealSections(json.sections);
      setRevealStatus("success");
    } catch {
      setRevealStatus("error");
    }
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40  bg-black/70 transition-opacity duration-500",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        inert={!open}
        aria-label={view === "travel" ? "Get MY Dates" : "Booking form"}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-2xl bg-black/50 backdrop-blur-lg shadow-2xl",
          view === "intro" ? "p-0" : "border border-white/20 p-7 lg:p-10",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        )}
        style={{ transition: "transform 500ms ease-in-out, opacity 500ms ease-in-out" }}
      >
        <button
          type="button"
          onClick={resetAndClose}
          aria-label="Close booking form"
          className="absolute z-10 text-2xl right-9 top-9 uppercase tracking-[-0.05rem] text-white transition-opacity hover:opacity-70"
        >
          ✕
        </button>

        {view === "booking" && (
          <>
            <h2 className="text-white">BOOKING FORM</h2>
            <small className="mt-2 block text-white/70">
              Step {step} of {STEPS}
            </small>
          </>
        )}

        {view === "travel" && <h2 className="text-white">GET MY DATES</h2>}

        <div
          className={cn(
            "relative overflow-x-hidden transition-[height] duration-500 ease-in-out",
            view === "intro" ? "mt-0 overflow-y-hidden" : "mt-6 max-h-[65vh] overflow-y-auto pr-3"
          )}
          style={{ height: containerHeight ?? undefined }}
        >
          <AnimatedStep key={`${view}-${step}-${travelSubView}`} contentRef={contentRef} direction={direction}>
            {view === "intro" && (
              <div className="relative aspect-3/4 w-full overflow-hidden border border-white/10 rounded-2xl">
                <BlurInImage src="/images/professional/IMG_6845.jpeg" />
                <div className="absolute inset-0 bg-black/70" />
                <div className="pointer-events-none absolute inset-3 rounded-xl border border-white/50 sm:inset-4" />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-9 text-center">
                  <h2 className="w-full text-white">LET&rsquo;S CONNECT</h2>
                  <div className="h-px w-12 shrink-0 bg-white/40" />
                  <AnimatedParagraph active={contentVisible} className="w-full max-w-xs text-white/80">
                    Ready to book a session, or just passing through? Let me
                    know either way — pick an option below.
                  </AnimatedParagraph>

                  <div className="mt-2 flex w-full max-w-xs  flex-col gap-3">
                    <Button
                      variant="ghost"
                      onClick={goToBooking}
                      className="text-sm font-semibold bg-white text-black  hover:border-white"
                    >
                      Booking Form
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={goToTravel}
                      className="border shadow-black/10 backdrop-blur-md text-sm font-semibold border-white/30 hover:border-white"
                    >
                      See Travel Dates
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {view === "booking" && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {step === 1 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="First name" htmlFor="booking-first-name">
                        <input
                          id="booking-first-name"
                          type="text"
                          required
                          value={data.firstName}
                          onChange={(e) => update("firstName", e.target.value)}
                          className={inputClasses}
                        />
                      </Field>
                      <Field label="Last name" htmlFor="booking-last-name">
                        <input
                          id="booking-last-name"
                          type="text"
                          required
                          value={data.lastName}
                          onChange={(e) => update("lastName", e.target.value)}
                          className={inputClasses}
                        />
                      </Field>
                    </div>

                    <Field label="Race / Nationality" htmlFor="booking-nationality">
                      <input
                        id="booking-nationality"
                        type="text"
                        value={data.nationality}
                        onChange={(e) => update("nationality", e.target.value)}
                        className={inputClasses}
                      />
                    </Field>

                    <Field label="Age" htmlFor="booking-age">
                      <input
                        id="booking-age"
                        type="number"
                        min="18"
                        value={data.age}
                        onChange={(e) => update("age", e.target.value)}
                        className={inputClasses}
                      />
                    </Field>

                    <Field label="LinkedIn or professional page" htmlFor="booking-linkedin">
                      <input
                        id="booking-linkedin"
                        type="url"
                        placeholder="https://"
                        value={data.linkedin}
                        onChange={(e) => update("linkedin", e.target.value)}
                        className={inputClasses}
                      />
                    </Field>

                    <div className="mt-2 flex gap-3">
                      <Button variant="ghost" onClick={backToIntro} className="h-11 flex-1">
                        Back
                      </Button>
                      <Button variant="solid" onClick={goNext} className="h-11 flex-1">
                        Next
                      </Button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Field label="Where would you like to meet me" htmlFor="booking-service-type">
                      <input
                        id="booking-service-type"
                        type="text"
                        value={data.serviceType}
                        onChange={(e) => update("serviceType", e.target.value)}
                        className={inputClasses}
                      />
                    </Field>

                    <div className="relative flex flex-col gap-1.5">
                      <small className="capitalise font-semibold text-white/60">Duration</small>
                      <button
                        type="button"
                        onClick={() => setDurationOpen((prev) => !prev)}
                        aria-expanded={durationOpen}
                        className={cn(inputClasses, "flex items-center justify-between text-left")}
                      >
                        <span className={data.duration ? "text-white" : "text-white/40"}>
                          {data.duration || "Select duration"}
                        </span>
                        <span
                          className={cn(
                            "transition-transform duration-200",
                            durationOpen && "rotate-180"
                          )}
                          aria-hidden="true"
                        >
                          ▾
                        </span>
                      </button>

                      <div
                        className={cn(
                          "grid min-h-0 transition-all duration-300 ease-out",
                          durationOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        )}
                      >
                        <div className="overflow-hidden">
                          <div className="mt-1 flex flex-col overflow-hidden rounded-lg border border-white/15 bg-white/5">
                            {DURATIONS.map((duration) => (
                              <button
                                key={duration}
                                type="button"
                                onClick={() => {
                                  update("duration", duration);
                                  setDurationOpen(false);
                                }}
                                className={cn(
                                  "px-3 py-2 text-left transition-colors hover:bg-white/10",
                                  data.duration === duration ? "text-white" : "text-white/70"
                                )}
                              >
                                {duration}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Date" htmlFor="booking-date">
                        <input
                          id="booking-date"
                          type="date"
                          value={data.date}
                          onChange={(e) => update("date", e.target.value)}
                          className={inputClasses}
                        />
                      </Field>
                      <Field label="Time" htmlFor="booking-time">
                        <input
                          id="booking-time"
                          type="time"
                          value={data.time}
                          onChange={(e) => update("time", e.target.value)}
                          className={inputClasses}
                        />
                      </Field>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <small className="capitalise font-semibold text-white/60">Preferred way of contact</small>
                      <div className="flex flex-wrap gap-2">
                        {CONTACT_METHODS.map(({ key }) => (
                          <Pill
                            key={key}
                            selected={data.contactMethod === key}
                            onClick={() => selectContactMethod(key)}
                          >
                            {key}
                          </Pill>
                        ))}
                      </div>

                      {data.contactMethod === "WhatsApp" ? (
                        <WhatsAppFields
                          country={data.country}
                          value={data.contactValue}
                          onCountryChange={(v) => update("country", v)}
                          onValueChange={(v) => update("contactValue", v)}
                        />
                      ) : (
                        data.contactMethod && (
                          <input
                            type="text"
                            placeholder={
                              CONTACT_METHODS.find(({ key }) => key === data.contactMethod)?.placeholder
                            }
                            aria-label={data.contactMethod}
                            value={data.contactValue}
                            onChange={(e) => update("contactValue", e.target.value)}
                            className={cn(inputClasses, "mt-2")}
                          />
                        )
                      )}
                    </div>

                    <div className="mt-2 flex gap-3">
                      <Button variant="ghost" onClick={goBack} className="h-11 flex-1">
                        Back
                      </Button>
                      <Button variant="solid" onClick={goNext} className="h-11 flex-1">
                        Next
                      </Button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <Field label="Self introduction" htmlFor="booking-self-intro">
                      <textarea
                        id="booking-self-intro"
                        rows={3}
                        value={data.selfIntro}
                        onChange={(e) => update("selfIntro", e.target.value)}
                        className={cn(inputClasses, "h-auto resize-none py-2")}
                      />
                    </Field>

                    <Field label="Make a wish" htmlFor="booking-wish">
                      <input
                        id="booking-wish"
                        type="text"
                        value={data.wish}
                        onChange={(e) => update("wish", e.target.value)}
                        className={inputClasses}
                      />
                    </Field>

                    <Field label="Material" htmlFor="booking-material">
                      <input
                        id="booking-material"
                        type="file"
                        onChange={(e) => update("material", e.target.files?.[0] ?? null)}
                        className={cn(
                          inputClasses,
                          "h-auto py-2 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white file:transition-colors hover:file:bg-white/20"
                        )}
                      />
                    </Field>

                    <label htmlFor="booking-terms" className="flex items-start gap-2.5 text-white/70">
                      <input
                        id="booking-terms"
                        type="checkbox"
                        required
                        checked={data.agreedToTerms}
                        onChange={(e) => update("agreedToTerms", e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-white"
                      />
                      <span>
                        I agree to the{" "}
                        <a
                          href="/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white underline underline-offset-2 hover:opacity-70"
                        >
                          Terms and Conditions
                        </a>
                      </span>
                    </label>

                    {status === "error" && (
                      <AnimatedParagraph className="text-sm text-red-400">
                        Something went wrong sending your request. Please try again.
                      </AnimatedParagraph>
                    )}

                    <div className="mt-2 flex gap-3">
                      <Button variant="ghost" onClick={goBack} className="h-11 flex-1">
                        Back
                      </Button>
                      <Button
                        variant="solid"
                        type="submit"
                        disabled={status === "submitting"}
                        className="h-11 flex-1 disabled:opacity-60"
                      >
                        {status === "submitting" ? "Sending..." : "finish"}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            )}

            {view === "travel" && travelSubView === "intro" && (
              <div className="flex flex-col items-center gap-5 text-center">
                <AnimatedParagraph active={contentVisible} className="text-white/80">
                  AI scraps Ad sites - I do not like that. Travel dates are shared with screened contacts only. Apply
                  below — once you pass screening, you&rsquo;ll get a token by
                  email that unlocks the dates for anywhere from a few hours
                  up to 30 days.
                </AnimatedParagraph>

                <div className="mt-2 flex w-full flex-col gap-3">
                  <Button
                    variant="ghost"
                    onClick={goToTravelReveal}
                    className="border shadow-black/10 backdrop-blur-md text-sm font-semibold border-white/30 hover:border-white"
                  >
                    Reveal Travel Dates
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={goToTravelApply}
                    className="text-sm font-semibold bg-white text-black hover:border-white"
                  >
                    Apply for a Token
                  </Button>
                </div>

                <Button variant="ghost" onClick={backToIntro} className="mt-2 h-11 w-full">
                  Back
                </Button>
              </div>
            )}

            {view === "travel" && travelSubView === "reveal" && (
              <form onSubmit={handleRevealSubmit} className="flex flex-col gap-4">
                <Field label="Key" htmlFor="travel-reveal-token">
                  <input
                    id="travel-reveal-token"
                    type="text"
                    required
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="Key in your token"
                    value={revealToken}
                    onChange={(e) => {
                      setRevealToken(e.target.value);
                      setRevealStatus("idle");
                    }}
                    className={inputClasses}
                  />
                </Field>

                {revealStatus === "error" && (
                  <AnimatedParagraph className="text-sm text-red-400">
                    That token is invalid or has expired.
                  </AnimatedParagraph>
                )}

                {revealStatus === "success" && (
                  <div className="flex flex-col gap-4 rounded-lg border border-white/15 bg-white/5 p-4">
                    {revealSections.map((section) => (
                      <div key={section.label} className="flex flex-col gap-1">
                        <small className="uppercase text-white/60">{section.label}</small>
                        <p className="whitespace-pre-line text-white/90">{section.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-2 flex gap-3">
                  <Button variant="ghost" onClick={backToTravelIntro} className="h-11 flex-1">
                    Back
                  </Button>
                  <Button
                    variant="solid"
                    type="submit"
                    disabled={revealStatus === "checking" || !revealToken}
                    className="h-11 flex-1 disabled:opacity-60"
                  >
                    {revealStatus === "checking" ? "Checking..." : "Unlock"}
                  </Button>
                </div>
              </form>
            )}

            {view === "travel" && travelSubView === "apply" && (
              <form onSubmit={handleTravelSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First name" htmlFor="travel-first-name">
                    <input
                      id="travel-first-name"
                      type="text"
                      required
                      value={travelData.firstName}
                      onChange={(e) => updateTravel("firstName", e.target.value)}
                      className={inputClasses}
                    />
                  </Field>
                  <Field label="Last name" htmlFor="travel-last-name">
                    <input
                      id="travel-last-name"
                      type="text"
                      required
                      value={travelData.lastName}
                      onChange={(e) => updateTravel("lastName", e.target.value)}
                      className={inputClasses}
                    />
                  </Field>
                </div>

                <Field label="Email" htmlFor="travel-email">
                  <input
                    id="travel-email"
                    type="email"
                    required
                    value={travelData.email}
                    onChange={(e) => updateTravel("email", e.target.value)}
                    className={inputClasses}
                  />
                </Field>

                <Field label="Brief message (optional)" htmlFor="travel-message">
                  <input
                    id="travel-message"
                    type="text"
                    value={travelData.message}
                    onChange={(e) => updateTravel("message", e.target.value)}
                    className={inputClasses}
                  />
                </Field>

                <Field label="LinkedIn or company link" htmlFor="travel-linkedin">
                  <input
                    id="travel-linkedin"
                    type="url"
                    placeholder="https://"
                    value={travelData.linkedin}
                    onChange={(e) => updateTravel("linkedin", e.target.value)}
                    className={inputClasses}
                  />
                </Field>

                <Field label="ID (Might need for US dates)" htmlFor="travel-id-document">
                  <input
                    id="travel-id-document"
                    type="file"
                    onChange={(e) => updateTravel("idDocument", e.target.files?.[0] ?? null)}
                    className={cn(
                      inputClasses,
                      "h-auto py-2 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white file:transition-colors hover:file:bg-white/20"
                    )}
                  />
                </Field>

                <div className="flex flex-col gap-1.5">
                  <small className="uppercase text-white/70">Locations you&rsquo;re interested in</small>
                  <div className="flex flex-wrap gap-2">
                    {TRAVEL_LOCATIONS.map((loc) => (
                      <Pill
                        key={loc}
                        selected={travelData.locations.includes(loc)}
                        onClick={() => toggleLocation(loc)}
                      >
                        {loc}
                      </Pill>
                    ))}
                  </div>
                </div>

                {travelStatus === "error" && (
                  <AnimatedParagraph className="text-sm text-red-400">
                    Something went wrong sending your request. Please try again.
                  </AnimatedParagraph>
                )}

                <div className="mt-2 flex gap-3">
                  <Button variant="ghost" onClick={backToTravelIntro} className="h-11 flex-1">
                    Back
                  </Button>
                  <Button
                    variant="solid"
                    type="submit"
                    disabled={travelStatus === "submitting"}
                    className="h-11 flex-1 disabled:opacity-60"
                  >
                    {travelStatus === "submitting" ? "Sending..." : "Submit"}
                  </Button>
                </div>
              </form>
            )}
          </AnimatedStep>
        </div>

        {view === "booking" && <ProgressBar step={step} />}
      </div>
    </>,
    document.body
  );
}
