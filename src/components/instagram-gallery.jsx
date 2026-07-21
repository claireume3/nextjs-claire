"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatedParagraph } from "@/components/animated-paragraph";
import { Menu } from "@/components/navigation/menu";
import { MultiPhotoIcon } from "@/components/multi-photo-icon";
import { PostModal } from "@/components/post-modal";

const AVATAR_SRC = "/images/professional/IMG_1324.JPG";
const NAME = "Claire Umezawa";
const HANDLE = "@claireumezawa";
const BIO = "Enigmatic traveler + a nerdy streak.";

export function InstagramGallery({ posts }) {
  // Doubles as "which post" and "is the modal open" — no separate boolean.
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <>
      <Menu />
      <section className="w-full bg-background pb-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 pt-28 text-center sm:pt-36">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/5 sm:h-32 sm:w-32">
            <Image src={AVATAR_SRC} alt={NAME} fill sizes="8rem" className="object-cover" />
          </div>
          <div>
            <h1 className="text-white">{NAME}</h1>
            <p className="text-sm text-white/50">{HANDLE}</p>
          </div>
          <AnimatedParagraph className="max-w-xs text-sm text-white/80">{BIO}</AnimatedParagraph>
        </div>

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-0.5 px-0.5 sm:gap-1 sm:px-1">
          {posts.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => setSelectedPost(post)}
              aria-label="Open post"
              className="relative aspect-square overflow-hidden bg-white/5"
            >
              <Image src={post.images[0]} alt="" fill sizes="33vw" className="object-cover" />
              {post.images.length > 1 && (
                <MultiPhotoIcon className="absolute right-1.5 top-1.5 h-4 w-4 text-white drop-shadow sm:h-5 sm:w-5" />
              )}
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
