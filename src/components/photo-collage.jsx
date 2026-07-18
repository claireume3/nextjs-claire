import Image from "next/image";
import { AnimatedParagraph } from "@/components/animated-paragraph";
import { Reveal } from "@/components/reveal";
import { Subcaption } from "@/components/subcaption";
import { ViewMoreButton } from "@/components/view-more-button";

// First letter of each keyword phrase renders in the accent script font —
// same per-letter treatment as the hero caption (CLAIRE UMEZAWA's C/W).
const KEYWORDS = ["Amanjunkie", "First Growth", "City Walks", "Heritage Luxury"];

function Keyword({ text }) {
  return (
    <>
      <span className="[font-family:var(--font-windsong)] text-[1.3em] normal-case">
        {text[0]}
      </span>
      <span>{text.slice(1)}</span>
    </>
  );
}

// Asymmetric gallery grid — dense-packed, no overlap, generous gaps.
const CLUSTER = [
  {
    src: "/images/photography/5AF31B8A-67B1-4522-94F8-9F5A1CE2B0F9-32505-0000047935762B5A_VSCO.JPG",
    className: "row-span-2",
  },
  {
    src: "/images/photography/C9CECC5A-FBF5-40BF-85DE-1309CA447255-32505-000004771B7AE661_VSCO.JPG",
    className: "col-span-2",
  },
  {
    src: "/images/photography/IMG_7623.jpg",
    className: "",
  },
  {
    src: "/images/photography/FOUR_SEASONS.JPG",
    className: "",
  },
  {
    src: "/images/photography/IMG_7871.jpg",
    className: "col-span-2",
  },
];

export function PhotoCollage() {
  return (
    <section className="grid w-full grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-[2fr_3fr] sm:gap-16 sm:px-16 sm:py-16">
      <div className="flex flex-col justify-center gap-4 text-center sm:text-left">
        <Reveal direction="left" duration={500} className="flex flex-col gap-4">
          <h2 className="text-white">The Road Unfolds</h2>
          <AnimatedParagraph className="text-white/70">
            I have been fortunate to model, travel extensively, and experience
            extraordinary adventures. If a picture is worth a thousand words,
            perhaps my travel gallery says the rest better than I ever could.
          </AnimatedParagraph>
        </Reveal>

        <Reveal direction="right" duration={500} className="mt-6 flex flex-col gap-1">
          <Subcaption>Keywords</Subcaption>
          <AnimatedParagraph className="my-3 font-serif text-2xl uppercase tracking-wide text-white sm:text-3xl">
            {KEYWORDS.map((word, i) => (
              <span key={word}>
                <Keyword text={word} />
                {i < KEYWORDS.length - 1 && <span className="mx-2 normal-case">·</span>}
              </span>
            ))}
          </AnimatedParagraph>
        </Reveal>

        <Reveal direction="left" duration={500}>
          <ViewMoreButton href="/gallery/selfies-travel" className="mx-auto mt-2 w-fit sm:mx-0">
            View More
          </ViewMoreButton>
        </Reveal>
      </div>

      <div className="grid grid-flow-dense grid-cols-2 auto-rows-35 gap-2 sm:h-full sm:grid-cols-4 sm:grid-rows-2">
        {CLUSTER.map((photo) => (
          <div
            key={photo.src}
            className={`relative overflow-hidden rounded-md border border-white/20 bg-white/5 shadow-lg ${photo.className}`}
          >
            <Image
              src={photo.src}
              alt=""
              fill
              sizes="(min-width: 640px) 25vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
