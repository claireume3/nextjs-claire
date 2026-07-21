// Small "stacked photos" indicator (matches Instagram's multi-photo-post
// icon) — two overlapping rounded-square outlines.
export function MultiPhotoIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="7"
        y="2"
        width="15"
        height="15"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
        fill="rgba(0,0,0,0.25)"
      />
      <rect
        x="2"
        y="7"
        width="15"
        height="15"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
        fill="rgba(255,255,255,0.8)"
      />
    </svg>
  );
}
