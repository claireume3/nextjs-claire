"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const INTERACTIVE_SELECTOR =
  "a, button, input, textarea, select, label, [role='button'], [data-cursor-pointer]";

// Site-wide replacement for the native cursor (see the matching
// `cursor: none` override in globals.css) — a small circle that follows
// the pointer 1:1 via direct style writes (skipping React state so it
// doesn't re-render on every mousemove), and grows/brightens whenever the
// pointer lands on something clickable. Fine-pointer devices only: touch
// has no hover state for this to represent, so it never mounts there.
export function CustomCursor() {
  const dotRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const raf = requestAnimationFrame(() => setEnabled(mql.matches));
    const onChange = (e) => setEnabled(e.matches);
    mql.addEventListener("change", onChange);
    return () => {
      cancelAnimationFrame(raf);
      mql.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const onMove = (e) => {
      if (dot) {
        dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };
    const onOver = (e) => {
      setHovering(Boolean(e.target.closest?.(INTERACTIVE_SELECTOR)));
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-200 rounded-full border-2 transition-[width,height,border-color] duration-200 ease-out",
        hovering ? "h-8 w-8 border-white/80" : "h-4 w-4 border-white/50"
      )}
    />
  );
}
