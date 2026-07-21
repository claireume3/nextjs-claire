"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { cn } from "@/lib/utils";

const LIKED_KEY = "selfies-travel-liked-posts";

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
  const [imageIndex, setImageIndex] = useState(0);
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
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const toggleLike = () => {
    const set = readLikedSet();
    if (set.has(post.id)) set.delete(post.id);
    else set.add(post.id);
    localStorage.setItem(LIKED_KEY, JSON.stringify([...set]));
    setLiked(set.has(post.id));
  };

  const likeCount = post.likes + (liked ? 1 : 0);

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
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/85 transition-opacity duration-300"
      />
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8"
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Post"
          onClick={(e) => e.stopPropagation()}
          className="relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 text-2xl text-white transition-opacity hover:opacity-70"
          >
            ✕
          </button>

          <div
            className="relative aspect-square w-full touch-pan-y overflow-hidden bg-white/5"
            onPointerDown={hasMultiple ? onPointerDown : undefined}
            onPointerUp={hasMultiple ? onPointerUp : undefined}
          >
            <div
              className="flex h-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${imageIndex * 100}%)` }}
            >
              {post.images.map((src, i) => (
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
          </div>

          {hasMultiple && (
            <div className="flex items-center justify-center gap-1.5 py-3">
              {post.images.map((src, i) => (
                <span
                  key={src}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors",
                    i === imageIndex ? "bg-white" : "bg-white/30"
                  )}
                />
              ))}
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
            <p className="text-sm font-semibold text-white">{likeCount.toLocaleString()} likes</p>
            {post.caption && <p className="text-sm text-white/80">{post.caption}</p>}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
