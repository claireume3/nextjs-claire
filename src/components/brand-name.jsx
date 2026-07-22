import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const CAPTION = "CLAIRE UMEZAWA";
const ACCENT_LETTERS = new Set(["C", "W"]);

function splitChars(text) {
  return text.split("").map((char) => ({ char, accent: ACCENT_LETTERS.has(char) }));
}

// Shared with anything that needs to reproduce the same accent-letter split
// outside plain HTML (e.g. SVG tspans on the /links page).
export function getBrandNameChars() {
  return splitChars(CAPTION);
}

function AccentChars({ text }) {
  return splitChars(text).map(({ char, accent }, i) =>
    accent ? (
      <span key={i} className="[font-family:var(--font-windsong)] text-[1.3em] normal-case">
        {char}
      </span>
    ) : (
      <span key={i}>{char}</span>
    )
  );
}

// Site wordmark — "CLAIRE UMEZAWA" with the first letter of each name in the
// accent script font (Windsong). Used full-size in the hero caption and
// smaller wherever the brand name repeats (e.g. the footer).
export function BrandName({ as: Tag = "span", className }) {
  return (
    <Tag className={cn("[font-family:var(--font-bodoni-moda)] font-normal", className)}>
      <AccentChars text={CAPTION} />
    </Tag>
  );
}

// Single word ("CLAIRE" or "UMEZAWA") with the same accent-letter styling
// as BrandName — for layouts that split the two names onto their own lines
// (e.g. the hero caption's staggered two-line wordmark) instead of one
// continuous string. forwardRef so callers can drive a transform directly
// via the DOM node (e.g. tying it to scroll position) without React state.
export const BrandNameWord = forwardRef(function BrandNameWord(
  { as: Tag = "span", word, className },
  ref
) {
  return (
    <Tag ref={ref} className={cn("[font-family:var(--font-bodoni-moda)] font-normal", className)}>
      <AccentChars text={word} />
    </Tag>
  );
});
