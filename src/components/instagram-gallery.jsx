"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatedParagraph } from "@/components/animated-paragraph";
import { Menu } from "@/components/navigation/menu";
import { MultiPhotoIcon } from "@/components/multi-photo-icon";
import { PostModal } from "@/components/post-modal";
import { cn } from "@/lib/utils";

const AVATAR_SRC = "/images/professional/IMG_1324.JPG";
const NAME = "Claire Umezawa";
const HANDLE = "@claireumezawa";
const BIO =
  "📵 Instagram keeps unfairly banning travel models, so I built my own corner of the internet instead 🏗️🍷. What's different here: 1️⃣ no timestamps — the feed shuffles into a brand new order every refresh, great for privacy 🕵️‍♀️ 2️⃣ DMs are off — zero harassment, zero drama 🚫 3️⃣ no like counts, honestly who cares 🤷‍♀️ 4️⃣ no weird censorship — I post whatever I want 🔥";

// How long the dark press-overlay holds on the clicked cell before the
// modal actually opens — a deliberate beat, not just an instant swap.
const PRESS_HOLD_MS = 250;

export function InstagramGallery({ posts }) {
  // Doubles as "which post" and "is the modal open" — no separate boolean.
  const [selectedPost, setSelectedPost] = useState(null);
  const [pressedId, setPressedId] = useState(null);

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
        <div className="mx-auto flex max-w-2xl items-center gap-5 px-6 pt-28 sm:max-w-4xl sm:gap-8 sm:pt-36">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/5 sm:h-32 sm:w-32">
            <Image src={AVATAR_SRC} alt={NAME} fill sizes="8rem" className="object-cover" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <h3 className="font-serif capitalize text-white">{NAME}</h3>
            <p className="font-serif text-sm subcaption tracking-wider mb-5">{HANDLE}</p>
            <AnimatedParagraph className="max-w-sm text-sm text-white/90 sm:max-w-md">{BIO}</AnimatedParagraph>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-0.5 px-0.5 sm:max-w-4xl sm:grid-cols-4 sm:gap-1 sm:px-1">
          {posts.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => openPost(post)}
              aria-label="Open post"
              className="group relative aspect-square overflow-hidden bg-white/5"
            >
              <Image
                src={post.images[0]}
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
