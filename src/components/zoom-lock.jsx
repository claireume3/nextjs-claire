"use client";

import { useEffect } from "react";

const ZOOM_KEYS = new Set(["+", "-", "=", "0"]);

// Mobile pinch-zoom is blocked via the viewport meta tag (layout.jsx's
// `viewport` export). This handles the desktop paths that meta tag can't
// reach: Ctrl/Cmd+scroll, Ctrl/Cmd +/-/0, and Safari's trackpad pinch
// gesture events.
export function ZoomLock() {
  useEffect(() => {
    const onWheel = (e) => {
      if (e.ctrlKey) e.preventDefault();
    };
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && ZOOM_KEYS.has(e.key)) e.preventDefault();
    };
    const onGesture = (e) => e.preventDefault();

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("gesturestart", onGesture);
    window.addEventListener("gesturechange", onGesture);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("gesturestart", onGesture);
      window.removeEventListener("gesturechange", onGesture);
    };
  }, []);

  return null;
}
