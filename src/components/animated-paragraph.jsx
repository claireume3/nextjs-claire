"use client";

import { Children, isValidElement, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const STAGGER_MS = 30;
const DURATION_MS = 550;

// Splits children into a flat list of "words" — whitespace-only string
// tokens pass through untouched, real words become animated units, and
// non-string children (e.g. a link inside a sentence) are kept intact as a
// single atomic unit rather than being split apart.
function splitIntoWordTokens(children) {
  const tokens = [];
  const walk = (node) => {
    if (typeof node === "string") {
      node.split(/(\s+)/).forEach((part) => {
        if (part !== "") tokens.push(part);
      });
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (isValidElement(node)) tokens.push(node);
  };
  Children.forEach(children, walk);
  return tokens;
}

// Pairs each non-whitespace token with its stagger delay in one pass, so
// rendering itself never mutates a shared counter.
function withDelays(tokens) {
  let index = 0;
  return tokens.map((token) => {
    const isWhitespace = typeof token === "string" && token.trim() === "";
    const delay = isWhitespace ? null : index * STAGGER_MS;
    if (!isWhitespace) index += 1;
    return { token, delay };
  });
}

// Reveals paragraph text word by word — each word slides up out of a
// clipped mask with a short stagger. By default that triggers the first
// time the paragraph scrolls into view; as text wraps, words on the same
// line reveal in quick succession, reading as a line-by-line sweep.
//
// Pass `active` for paragraphs inside something like a modal that's
// already in the layout (so it'd "scroll into view" immediately) but only
// actually visible once its own open state flips — e.g. `active={open}` —
// so the word reveal plays when the modal opens instead of firing the
// instant it mounts, unseen, behind opacity-0.
export function AnimatedParagraph({ as: Tag = "p", children, className, active, ...props }) {
  const ref = useRef(null);
  const [scrolledIntoView, setScrolledIntoView] = useState(false);
  const controlled = active !== undefined;
  const visible = controlled ? active : scrolledIntoView;

  useEffect(() => {
    if (controlled) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setScrolledIntoView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [controlled]);

  const items = withDelays(splitIntoWordTokens(children));

  return (
    // min-w-0: wrapping each word in its own inline-block span (for the
    // clip-mask reveal) inflates this element's intrinsic min-content width
    // enough that, as a flex item inside a flex-col ancestor (e.g. the
    // carousel's per-slide text column), it refuses to shrink to the
    // column's actual width and overflows sideways instead of wrapping.
    <Tag ref={ref} className={cn("min-w-0", className)} {...props}>
      {items.map(({ token, delay }, i) => {
        if (delay === null) return token;

        return (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <span
              className={cn(
                "inline-block transition-all ease-out",
                visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
              )}
              style={{ transitionDuration: `${DURATION_MS}ms`, transitionDelay: `${delay}ms` }}
            >
              {token}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
