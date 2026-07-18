"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";

// /links is a standalone bio-link page — no site chrome, so it skips the footer.
const HIDDEN_ON = ["/links"];

export function ConditionalFooter() {
  const pathname = usePathname();
  if (HIDDEN_ON.includes(pathname)) return null;
  return <Footer />;
}
