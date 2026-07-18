"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";

const STEPS = 3;

const SERVICE_TYPES = ["Studio Shoot", "Editorial", "Travel Shoot"];
const DURATIONS = ["30 minutes", "1 hour", "2 hours", "Half day", "Full day"];
const CONTACT_METHODS = [
  { key: "Email", placeholder: "you@example.com" },
  { key: "Telegram", placeholder: "@username" },
  { key: "WhatsApp", placeholder: "+1 234 567 8900" },
];
const TRAVEL_LOCATIONS = ["US", "UK", "SG", "HK"];

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
  selfIntro: "",
  wish: "",
  agreedToTerms: false,
};

const INITIAL_TRAVEL_DATA = {
  firstName: "",
  lastName: "",
  contactMethod: "",
  contactValue: "",
  screening: "",
  locations: [],
};

function Field({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="uppercase tracking-[-0.05rem] text-white/70">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClasses =
  "h-10 rounded-lg mb-2 border border-white/20 bg-white/5 px-3 text-white outline-none transition-colors focus:border-white/50";

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
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setContainerHeight(el.offsetHeight);
    const ro = new ResizeObserver((entries) => {
      setContainerHeight(entries[0].contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [view, step]);

  const goNext = () => {
    setDirection("forward");
    setStep((prev) => prev + 1);
  };

  const goBack = () => {
    setDirection("back");
    setStep((prev) => prev - 1);
  };

  const goToBooking = () => setView("booking");
  const goToTravel = () => setView("travel");
  const backToIntro = () => setView("intro");

  const update = (field, value) => setData((prev) => ({ ...prev, [field]: value }));
  const updateTravel = (field, value) => setTravelData((prev) => ({ ...prev, [field]: value }));

  const selectContactMethod = (key) =>
    setData((prev) => ({ ...prev, contactMethod: key, contactValue: "" }));

  const selectTravelContactMethod = (key) =>
    setTravelData((prev) => ({ ...prev, contactMethod: key, contactValue: "" }));

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, formType: "booking" }),
      });
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
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...travelData, formType: "travel-interest" }),
      });
      if (!res.ok) throw new Error("Request failed");
      resetAndClose();
    } catch {
      setTravelStatus("error");
    }
  };

  return (
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
        aria-label={view === "travel" ? "Travel dates interest form" : "Booking form"}
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
            <h2 className="tracking-[0.1rem] text-white">BOOKING FORM</h2>
            <small className="mt-2 block text-white/70">
              Step {step} of {STEPS}
            </small>
          </>
        )}

        {view === "travel" && <h2 className="tracking-[0.1rem] text-white">TRAVEL DATES INTEREST</h2>}

        <div
          className={cn(
            "relative overflow-hidden transition-[height] duration-500 ease-in-out",
            view === "intro" ? "mt-0" : "mt-6"
          )}
          style={{ height: containerHeight ?? undefined }}
        >
          <AnimatedStep key={`${view}-${step}`} contentRef={contentRef} direction={direction}>
            {view === "intro" && (
              <div className="relative aspect-3/4 w-full overflow-hidden border border-white/10 rounded-2xl">
                <BlurInImage src="/images/professional/IMG_6845.jpeg" />
                <div className="absolute inset-0 bg-black/70" />
                <div className="pointer-events-none absolute inset-3 rounded-xl border border-white/50 sm:inset-4" />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-9 text-center">
                  <h2 className="w-full tracking-[0.15em] text-white">LET&rsquo;S CONNECT</h2>
                  <div className="h-px w-12 shrink-0 bg-white/40" />
                  <p className="w-full max-w-xs text-white/80">
                    Ready to book a session, or just passing through? Let me
                    know either way — pick an option below.
                  </p>

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
                      Travel Dates Interest
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
                    <div className="flex flex-col gap-1.5">
                      <small className="uppercase tracking-wider text-white/70">Service type</small>
                      <div className="flex flex-wrap gap-2">
                        {SERVICE_TYPES.map((service) => (
                          <Pill
                            key={service}
                            selected={data.serviceType === service}
                            onClick={() => update("serviceType", service)}
                          >
                            {service}
                          </Pill>
                        ))}
                      </div>
                    </div>

                    <div className="relative flex flex-col gap-1.5">
                      <small className="uppercase text-white/70">Duration</small>
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
                      <small className="uppercase text-white/70">Preferred way of contact</small>
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

                      {data.contactMethod && (
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
                      <textarea
                        id="booking-wish"
                        rows={3}
                        value={data.wish}
                        onChange={(e) => update("wish", e.target.value)}
                        className={cn(inputClasses, "h-auto resize-none py-2")}
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
                      <p className="text-sm text-red-400">
                        Something went wrong sending your request. Please try again.
                      </p>
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

            {view === "travel" && (
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

                <div className="flex flex-col gap-1.5">
                  <small className="uppercase text-white/70">Preferred way of contact</small>
                  <div className="flex flex-wrap gap-2">
                    {CONTACT_METHODS.map(({ key }) => (
                      <Pill
                        key={key}
                        selected={travelData.contactMethod === key}
                        onClick={() => selectTravelContactMethod(key)}
                      >
                        {key}
                      </Pill>
                    ))}
                  </div>

                  {travelData.contactMethod && (
                    <input
                      type="text"
                      placeholder={
                        CONTACT_METHODS.find(({ key }) => key === travelData.contactMethod)
                          ?.placeholder
                      }
                      aria-label={travelData.contactMethod}
                      value={travelData.contactValue}
                      onChange={(e) => updateTravel("contactValue", e.target.value)}
                      className={cn(inputClasses, "mt-2")}
                    />
                  )}
                </div>

                <Field label="Screening information" htmlFor="travel-screening">
                  <textarea
                    id="travel-screening"
                    rows={3}
                    value={travelData.screening}
                    onChange={(e) => updateTravel("screening", e.target.value)}
                    className={cn(inputClasses, "h-auto resize-none py-2")}
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
                  <p className="text-sm text-red-400">
                    Something went wrong sending your request. Please try again.
                  </p>
                )}

                <div className="mt-2 flex gap-3">
                  <Button variant="ghost" onClick={backToIntro} className="h-11 flex-1">
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
    </>
  );
}
