import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const BRAND_NAME = "Claire Umezawa";

// Note: Hopeless Romantic Society renders noticeably larger than the font
// this replaced at the same Tailwind text-size classes — rather than bake
// a scale-down in here (any text-size utility a caller passes via
// `className` would win the tailwind-merge conflict and silently cancel
// it), each usage site's own size classes were turned down instead.
const FONT_CLASS = "[font-family:var(--font-hopeless-romantic)] font-normal";

// Site wordmark — "Claire Umezawa" in the Hopeless Romantic Society display
// font, used uniformly everywhere the brand name appears (hero caption,
// footer, /links profile circle).
export function BrandName({ as: Tag = "span", className }) {
  return <Tag className={cn(FONT_CLASS, className)}>{BRAND_NAME}</Tag>;
}

// Single word ("CLAIRE" or "UMEZAWA") in the same font — for layouts that
// split the two names onto their own lines (e.g. the hero caption's
// staggered two-line wordmark) instead of one continuous string.
// forwardRef so callers can drive a transform directly via the DOM node
// (e.g. tying it to scroll position) without React state.
export const BrandNameWord = forwardRef(function BrandNameWord({ as: Tag = "span", word, className }, ref) {
  return (
    <Tag ref={ref} className={cn(FONT_CLASS, className)}>
      {word}
    </Tag>
  );
});
