import Image from "next/image";
import { AnimatedParagraph } from "@/components/animated-paragraph";
import { Menu } from "@/components/navigation/menu";
import { Subcaption } from "@/components/subcaption";

const SIZING = [
  { label: "Clothing Size", value: "XXS/XS, US 00/UK 4/FR 34 (Runway Size!!)" },
  { label: "Jeans", value: "24" },
  { label: "Shoes", value: "36.5 / US 6.5" },
  { label: "Size", value: "30 C" },
];

// Categories from Gift Card through Jewellery link out — each item to its
// own brand site where known, otherwise a search fallback. Hobbies and
// Clothing stay plain text.
const PREFERENCES = [
  {
    category: "Gift Card",
    items: [{ name: "Aman", href: "https://gifts.aman.com/digital-aman-gift-card-029502" }],
  },
  {
    category: "Lingerie",
    items: [
      { name: "Bordelle", href: "https://www.bordelle.co.uk/products/virtual-gift-voucher?variant=45560200102026" },
      { name: "Mariemur", href: "https://mariemur.com/" },
      { name: "Anoeses", href: "https://anoeses.com/" },
    ],
    note: "All those you've seen in my galleries!",
  },
  {
    category: "Heels (I LOVE Italian shoe makers)",
    items: [
      { name: "Sergio Rossi", href: "https://www.sergiorossi.com" },
      { name: "Gianvito Rossi", href: "https://www.gianvitorossi.com" },
      { name: "Christian Louboutin", href: "https://www.christianlouboutin.com" },
      { name: "Tom Ford", href: "https://www.tomford.com" },
    ],
  },
  {
    category: "Jewellery",
    items: [
      { name: "Bvlgari", href: "https://www.bulgari.com" },
      { name: "Boucheron", href: "https://www.boucheron.com" },
      { name: "Graff", href: "https://www.graff.com" },
    ],
  },
  {
    category: "Hobbies",
    items: ["Leica Camera", "Golf Lessons & Membership", "Conference Executive Pass"],
  },
  {
    category: "Clothing",
    note: "See me in person to find out about my favorite designers.",
  },
];

function PreferenceRow({ category, items, note }) {
  return (
    <div className="flex flex-col gap-2 py-6 text-center sm:text-left">
      <Subcaption className="text-white tracking-wider">{category}</Subcaption>
      {items && (
        <AnimatedParagraph className="text-lg text-white sm:text-xl">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            const isLinked = typeof item === "object";
            return (
              <span key={isLinked ? item.name : item}>
                {isLinked ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
                  >
                    {item.name}
                  </a>
                ) : (
                  item
                )}
                {!isLast && " · "}
              </span>
            );
          })}
        </AnimatedParagraph>
      )}
      {note && <AnimatedParagraph className="text-white/80">{note}</AnimatedParagraph>}
    </div>
  );
}

export default function WishlistPage() {
  return (
    <>
      <Menu />
      <section className="w-full bg-background px-6 pb-20 pt-28 sm:px-16 sm:pt-36">
        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 sm:gap-12 lg:gap-16">
          <div className="flex flex-col justify-center text-center sm:text-left">
            <Subcaption>thank you for your effort</Subcaption>
            <h1 className="mt-2 text-white">Wishlist</h1>
            <div className="mx-auto mt-5 flex max-w-md flex-col gap-4 sm:mx-0">
              <AnimatedParagraph className="text-white/80">
                I was told, &ldquo;Please put more items on your wishlist so I
                can spoil you.&rdquo; While I do my best to add more items to
                Throne, they tend to get claimed quickly.
              </AnimatedParagraph>
              <AnimatedParagraph className="text-white/80">
                Also, I prefer to keep my unique taste a bit discreet. Most
                people who know that simply ask in person and bring me
                thoughtful gifts on our next date ;).
              </AnimatedParagraph>
              <AnimatedParagraph className="text-white/80">
                Due to the new price limit, I&rsquo;ll share my general
                preferences below.
              </AnimatedParagraph>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="relative aspect-3/4 overflow-hidden rounded-md border border-white/20 bg-white/5">
              <Image
                src="/images/professional/IMG_6778.jpeg"
                alt=""
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative mt-10 aspect-3/4 overflow-hidden rounded-md border border-white/20 bg-white/5 sm:mt-16">
              <Image
                src="/images/photography/IMG_7870.jpg"
                alt=""
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto my-14 max-w-2xl border-t border-white/10 pt-10">
          <div className="flex flex-col gap-1.5 text-center sm:text-left">
            <Subcaption className="tracking-wider">{SIZING[0].label}</Subcaption>
            <AnimatedParagraph className="text-white">{SIZING[0].value}</AnimatedParagraph>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-x-6 gap-y-6">
            {SIZING.slice(1).map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1.5 text-center sm:text-left">
                <Subcaption className="tracking-wider">{stat.label}</Subcaption>
                <AnimatedParagraph className="text-white">{stat.value}</AnimatedParagraph>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-col divide-y divide-white/10 border-t border-white/10">
          {PREFERENCES.map((preference) => (
            <PreferenceRow key={preference.category} {...preference} />
          ))}
        </div>
      </section>
    </>
  );
}
