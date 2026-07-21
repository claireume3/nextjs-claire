"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatedParagraph } from "@/components/animated-paragraph";
import { Menu } from "@/components/navigation/menu";
import { MultiPhotoIcon } from "@/components/multi-photo-icon";
import { PostModal } from "@/components/post-modal";
import { cn } from "@/lib/utils";

const AVATAR_SRC = "/images/professional/IMG_1324.JPG";
const NAME = "The Claire Edit";
const HANDLE = "@claireumezawa";
const BIO =
  "📵 Instagram keeps unfairly banning travel models, so I built my own corner of the internet instead 🏗️🍷. What's different here: 1️⃣ no timestamps — the feed shuffles into a brand new order every refresh, great for privacy 🕵️‍♀️ 2️⃣ NO DMs, 0 harassment, 0 drama 🚫 3️⃣ no like counts, honestly who cares 🤷‍♀️ 4️⃣ no weird censorship — I post whatever I want 🔥";

// How long the dark press-overlay holds on the clicked cell before the
// modal actually opens — a deliberate beat, not just an instant swap.
const PRESS_HOLD_MS = 250;

// Entrance sequence timing: pfp flips into view first, then the
// name/handle slide in from the left, then the grid cascades in — each
// cell staggered by its own flat index. CSS grid auto-placement already
// lays items out left-to-right, wrapping row by row, so staggering by
// index alone reads as "row one sweeps in, then row two, then row
// three..." without needing to know the column count per breakpoint.
const PFP_FLIP_DURATION_MS = 700;
const HEADER_TEXT_DELAY_MS = 300;
const HEADER_TEXT_DURATION_MS = 550;
const GRID_START_DELAY_MS = 750;
const GRID_STAGGER_MS = 45;

export function InstagramGallery({ posts }) {
  // Doubles as "which post" and "is the modal open" — no separate boolean.
  const [selectedPost, setSelectedPost] = useState(null);
  const [pressedId, setPressedId] = useState(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const openPost = (post) => {
    if (pressedId) return;
    setPressedId(post.id);
    setTimeout(() => {
      setSelectedPost(post);
      setPressedId(null);
    }, PRESS_HOLD_MS);
  };

  return (
    <>
      <Menu />
      <section className="w-full bg-background pb-20">
        <div
          className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-6 pt-20 sm:max-w-4xl sm:flex-row sm:items-center sm:gap-8 sm:pt-36"
          style={{ perspective: "800px" }}
        >
          <div
            className={cn(
              "relative h-40 w-40 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/5 transition-all ease-out sm:h-40 sm:w-40",
              entered ? "opacity-100 [transform:rotateY(0deg)]" : "opacity-0 [transform:rotateY(90deg)]"
            )}
            style={{ transitionDuration: `${PFP_FLIP_DURATION_MS}ms` }}
          >
            <Image src={AVATAR_SRC} alt={NAME} fill sizes="8rem" className="object-cover" />
          </div>
          <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
            <h3
              className={cn(
                "font-serif capitalize text-white transition-all ease-out",
                entered ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              )}
              style={{ transitionDuration: `${HEADER_TEXT_DURATION_MS}ms`, transitionDelay: `${HEADER_TEXT_DELAY_MS}ms` }}
            >
              {NAME}
            </h3>
            <p
              className={cn(
                "text-sm mb-3 subcaption tracking-wider transition-all ease-out",
                entered ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              )}
              style={{
                transitionDuration: `${HEADER_TEXT_DURATION_MS}ms`,
                transitionDelay: `${HEADER_TEXT_DELAY_MS + 100}ms`,
              }}
            >
              {HANDLE}
            </p>
            <AnimatedParagraph className="max-w-sm text-sm text-white/90 sm:max-w-xl">{BIO}</AnimatedParagraph>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-0.5 px-0.5 sm:max-w-4xl sm:grid-cols-4 sm:gap-1 sm:px-1">
          {posts.map((post, i) => (
            <button
              key={post.id}
              type="button"
              onClick={() => openPost(post)}
              aria-label="Open post"
              className={cn(
                "group relative aspect-square overflow-hidden bg-white/5 transition-all duration-500 ease-out",
                entered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              )}
              style={{ transitionDelay: `${GRID_START_DELAY_MS + i * GRID_STAGGER_MS}ms` }}
            >
              <Image
                src={post.images[0].src}
                alt=""
                fill
                sizes="(min-width: 640px) 25vw, 33vw"
                className="object-cover"
              />
              {post.images.length > 1 && (
                <MultiPhotoIcon className="absolute right-1.5 top-1.5 h-4 w-4 text-white drop-shadow sm:h-5 sm:w-5" />
              )}
              <div
                className={cn(
                  "absolute inset-0 bg-black transition-opacity",
                  pressedId === post.id
                    ? "opacity-30 duration-150"
                    : "opacity-0 duration-200 group-hover:opacity-20"
                )}
              />
            </button>
          ))}
        </div>
      </section>

      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </>
  );
}
