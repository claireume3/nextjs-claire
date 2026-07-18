// Minimal line-art rose mark — the site's logo. Single-color vector so it
// inherits `currentColor` for light/dark contexts. The bloom is one
// continuous spiral (a single rose, not a stack of shapes) with a small
// peeling petal tip, plus a thin stem and leaf.
export function Logo({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 21V13" />
      <path d="M12 17.2c-1.1-.1-1.9-.8-2-1.9 1.1.1 1.9.7 2 1.9z" />
      <path d="M12.6 4.3c2.1.4 3.7 2.2 3.7 4.4a4.5 4.5 0 0 1-4.5 4.5 3.7 3.7 0 0 1-3.7-3.7 3 3 0 0 1 3-3 2.5 2.5 0 0 1 2.5 2.5 2 2 0 0 1-2 2" />
      <path d="M15.4 5.3c.6.3 1 .8 1.3 1.4" />
    </svg>
  );
}
