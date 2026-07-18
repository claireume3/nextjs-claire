import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { Subcaption } from "@/components/subcaption";
import { cn } from "@/lib/utils";

// Placeholder values — replace with real stats.
const STATS = [
  { label: "Height", value: "5'4\" / 162cm" },
  { label: "Age", value: "Mid 20s, body age 23" },
  { label: "Education", value: "World Top 15, BBA+MA" },
  { label: "Size", value: "US 00 / XS / スペ115" },
  { label: "Idol", value: "Akira Kurosawa" },
  { label: "Shape", value: "Slim Hourglass, Lean & Toned" },
  { label: "Hobbies", value: "SECRET. I take my hobbies seriously. ", wide: true },
  {
    label: "Topics",
    value: " Scientific & social ethics, game theory, history (never gets old, pun intended), liquors.",
    wide: true,
  },
  {
    label: "TYPE OF GUY (FAQ):",
    value: "Trustworthy (quote: 信用できる人), passionate, intelligent, a little nerdy",
    wide: true,
  },
  { label: "STYLE", value: "Elegant & classical feminine, like Tokyo Calendar Girls ", wide: true },
];

export function ModelStats() {
  return (
    <section className="relative isolate w-full overflow-hidden px-6 py-12 sm:px-16 sm:py-16">
      {/* background: bridge/Poseidon photo — bg-fixed keeps it pinned
          to the viewport (not scrolling with the section) while staying
          clipped to this section's own box via overflow-hidden above */}
      <div
        className="absolute inset-0 -z-10 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/photography/C9CECC5A-FBF5-40BF-85DE-1309CA447255-32505-000004771B7AE661_VSCO.JPG')",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-black/60" />

      {/* glass envelope box */}
      <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-10 rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-xl sm:grid-cols-2 sm:gap-16 sm:p-12">
        <Reveal
          direction="left"
          className="relative aspect-2/3 w-full overflow-hidden rounded-lg border border-white/15 sm:aspect-auto sm:h-full"
        >
          <Image
            src="/images/professional/IMG_6862.jpeg"
            alt=""
            fill
            sizes="(min-width: 640px) 40vw, 90vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal direction="right">
          <h2 className="text-center text-white sm:text-left">Stats</h2>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  "flex flex-col gap-1.5 text-center sm:text-left",
                  stat.wide && "col-span-2"
                )}
              >
                <dt>
                  <Subcaption className="text-white/70">{stat.label}</Subcaption>
                </dt>
                <dd>
                  <h6 className="text-white">{stat.value}</h6>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
