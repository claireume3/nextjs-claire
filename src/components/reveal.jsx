"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Distance/direction the element travels from before settling into place.
const OFFSETS = {
  up: "translate-y-10",
  down: "-translate-y-10",
  left: "translate-x-10",
  right: "-translate-x-10",
  fade: "",
};

// Fades + slides children into place — either the first time they scroll
// into view (mode="scroll", the default), or unconditionally after `delay`
// once mounted (mode="mount", for entrances that need to happen in a fixed
// sequence regardless of scroll position, e.g. the homepage carousel
// finishing its own reveal before the promo popup starts sliding in).
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 700,
  className,
  as: Tag = "div",
  mode = "scroll",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (mode === "mount") {
      const timeout = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(timeout);
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mode, delay]);

  // "fade" never touches `transform` — a transform on an ancestor (even a
  // no-op translate(0,0)) breaks `background-attachment: fixed` on any
  // descendant, so directional offsets are opt-in via `direction`.
  const hasOffset = direction !== "fade";

  return (
    <Tag
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        // In "mount" mode, `delay` already pushed back the setTimeout that
        // flips `visible` — reapplying it as a transition-delay would wait
        // twice.
        ...(delay && mode !== "mount" ? { transitionDelay: `${delay}ms` } : null),
      }}
      className={cn(
        "transition-opacity ease-out",
        hasOffset && "transition-transform",
        visible ? "opacity-100" : "opacity-0",
        hasOffset && (visible ? "translate-x-0 translate-y-0" : OFFSETS[direction]),
        className
      )}
    >
      {children}
    </Tag>
  );
}
