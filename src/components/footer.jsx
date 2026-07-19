import Link from "next/link";
import { FaTelegram } from "react-icons/fa";
import { VscTwitter } from "react-icons/vsc";
import { AnimatedParagraph } from "@/components/animated-paragraph";
import { BrandName } from "@/components/brand-name";
import { Subcaption } from "@/components/subcaption";

// Placeholder handles — replace with real profile links.
const SOCIALS = [
  {
    href: "https://x.com/taleofclaire",
    label: "Former Twitter",
    Icon: VscTwitter,
  },
  {
    href: "https://t.me/+zGqchxeyVHQ4YmI1",
    label: "Telegram Channel",
    Icon: FaTelegram,
  },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-background px-6 py-16 sm:px-16">
      <div className="flex flex-col items-center gap-12">
        <Link
          href="/"
          className="flex w-full items-center justify-center gap-3 no-underline"
        >
          <BrandName className="text-2xl text-white sm:text-3xl" />
        </Link>

        <div className="grid grid-cols-1 gap-12 text-center sm:grid-cols-2">
          <div className="flex flex-col items-center gap-3">
            <Subcaption>Social</Subcaption>
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center font-semibold gap-2 font-serif text-md text-white/80 no-underline transition-colors duration-300 hover:text-subcaption "
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3">
            <Subcaption>Contact</Subcaption>
            <a
              href="https://t.me/claireumezawa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 no-underline transition-opacity hover:opacity-70"
            >
              Telegram: @claireumezawa
            </a>
            <a
              href="mailto:claireuesakabooking@protonmail.com"
              className="text-white/70 no-underline transition-opacity hover:opacity-70"
            >
              Email: claireuesakabooking@protonmail.com
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-md text-center">
        <AnimatedParagraph className="text-white/80">
          My SEO is intentionally poor — I don&rsquo;t want just anyone finding
          this profile. It still reaches the right people, since only
          searches for the brand name, Claire Umezawa, lead here.
        </AnimatedParagraph>
      </div>

      <div className="mt-12 border-t border-white/10 pt-6 text-center">
        <small className="text-white/40">
          © {new Date().getFullYear()} Claire Umezawa. All rights reserved.
        </small>
      </div>
    </footer>
  );
}
