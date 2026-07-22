"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";

// /links and /admin are standalone pages outside the normal site chrome,
// so both skip the public footer.
const HIDDEN_ON = ["/links", "/admin"];

export function ConditionalFooter() {
  const pathname = usePathname();
  if (HIDDEN_ON.includes(pathname)) return null;
  return <Footer />;
}
