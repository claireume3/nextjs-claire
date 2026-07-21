"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ArrowIcon } from "@/components/arrow-icon";
import { Sparkle } from "@/components/sparkle";
import { cn } from "@/lib/utils";

const LIKED_KEY = "selfies-travel-liked-posts";
const CLOSE_DURATION_MS = 300;

function readLikedSet() {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

// Instagram-style post lightbox — portalled to <body> (same reason as the
// booking form: any ancestor with position: sticky would otherwise trap
// this behind later sections). Swipeable photo(s) on top, like button
// (client-side only, persisted per-browser via localStorage — no comments,
// no backend) and caption below.
export function PostModal({ post, onClose }) {
  const [mounted, setMounted] = useState(false);
  // Separate from `mounted` on purpose: `mounted` just gates whether this
  // has entered the DOM at all (for the portal). `entered` flips true a
  // frame *after* that, once the "slid down, transparent" starting state
  // has actually painted once, so the transition to "slid up, visible" is
  // something the browser animates instead of skipping straight to.
  const [entered, setEntered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const closingRef = useRef(false);
  // Lazy initializer (not an effect): runs once on mount, reading real
  // localStorage during the client's first render — safe because the
  // component still returns null pre-`mounted` regardless, so there's
  // nothing server/client could mismatch on.
  const [liked, setLiked] = useState(() => readLikedSet().has(post.id));
  const startX = useRef(null);
  const hasMultiple = post.images.length > 1;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Slides the dialog back down before actually telling the parent to
  // unmount it, instead of just vanishing. useCallback so the Escape
  // listener below doesn't need to re-subscribe on every render.
  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setEntered(false);
    setTimeout(onClose, CLOSE_DURATION_MS);
  }, [onClose]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose]);

  const toggleLike = () => {
    const set = readLikedSet();
    if (set.has(post.id)) set.delete(post.id);
    else set.add(post.id);
    localStorage.setItem(LIKED_KEY, JSON.stringify([...set]));
    setLiked(set.has(post.id));
  };

  const onPointerDown = (e) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (startX.current == null) return;
    const delta = e.clientX - startX.current;
    if (delta > 50) setImageIndex((i) => Math.max(0, i - 1));
    else if (delta < -50) setImageIndex((i) => Math.min(post.images.length - 1, i + 1));
    startX.current = null;
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        aria-hidden="true"
        onClick={handleClose}
        className={cn(
          "fixed inset-0 z-[60] bg-black/85 transition-opacity duration-300",
          entered ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8"
        onClick={handleClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Post"
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl transition-all duration-300 ease-out",
            entered ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          )}
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 text-2xl text-white transition-opacity hover:opacity-70"
          >
            ✕
          </button>

          <div
            className="relative w-full touch-pan-y overflow-hidden bg-white/5 transition-[aspect-ratio] duration-300 ease-out"
            style={{ aspectRatio: post.images[imageIndex].width / post.images[imageIndex].height }}
            onPointerDown={hasMultiple ? onPointerDown : undefined}
            onPointerUp={hasMultiple ? onPointerUp : undefined}
          >
            <div
              className="flex h-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${imageIndex * 100}%)` }}
            >
              {post.images.map(({ src }, i) => (
                <div key={src} className="relative h-full w-full shrink-0">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 28rem, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {hasMultiple && (
              <>
                {imageIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setImageIndex((i) => Math.max(0, i - 1))}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-opacity hover:opacity-70 sm:flex"
                  >
                    <ArrowIcon className="h-3 -scale-x-100" />
                  </button>
                )}
                {imageIndex < post.images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setImageIndex((i) => Math.min(post.images.length - 1, i + 1))}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-opacity hover:opacity-70 sm:flex"
                  >
                    <ArrowIcon className="h-3" />
                  </button>
                )}
              </>
            )}
          </div>

          {hasMultiple && (
            <div className="flex items-center justify-center gap-1.5 py-3">
              {post.images.map(({ src }, i) =>
                i === imageIndex ? (
                  <Sparkle key={src} className="h-3.5 w-3.5 text-white" />
                ) : (
                  <span key={src} className="h-1.5 w-1.5 rounded-full bg-white/30 transition-colors" />
                )
              )}
            </div>
          )}

          <div className={cn("flex flex-col gap-2 px-5 pb-5", hasMultiple ? "pt-0" : "pt-4")}>
            <button
              type="button"
              onClick={toggleLike}
              aria-label={liked ? "Unlike" : "Like"}
              aria-pressed={liked}
              className="flex w-fit items-center text-white transition-transform hover:scale-110"
            >
              {liked ? (
                <FaHeart className="h-6 w-6 text-red-500" />
              ) : (
                <FaRegHeart className="h-6 w-6" />
              )}
            </button>
            {post.caption && <p className="text-sm text-white/80">{post.caption}</p>}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
