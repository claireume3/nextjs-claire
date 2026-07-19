import Image from "next/image";
import { AnimatedParagraph } from "@/components/animated-paragraph";
import { Menu } from "@/components/navigation/menu";
import { cn } from "@/lib/utils";

// Mobile stays 2 columns either way — only the sm/lg column count varies.
const COLUMN_CLASSES = {
  4: "columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4",
  3: "columns-2 gap-3 sm:columns-2 sm:gap-4 lg:columns-3",
};

export function GalleryPage({ title, caption, images, columns = 4, banner }) {
  return (
    <>
      <Menu />
      <section className="w-full bg-background pb-20">
        {banner && (
          <div className="relative h-[60vh] w-full overflow-hidden sm:h-[80vh]">
            <Image src={banner} alt="" fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-black/35" />
            <div
              className="absolute inset-x-0 bottom-0 h-32 sm:h-48"
              style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
            />
          </div>
        )}

        <div
          className={cn(
            "mx-auto max-w-5xl px-6 text-center sm:px-16 sm:text-left",
            banner ? "mt-6" : "pt-28 sm:pt-36"
          )}
        >
          <h1 className="text-white">{title}</h1>
          {caption && (
            <AnimatedParagraph className="mx-auto mt-3 max-w-xl text-white/80 sm:mx-0">{caption}</AnimatedParagraph>
          )}
        </div>

        <div className={cn("mx-auto mt-12 max-w-5xl px-6 sm:px-16", COLUMN_CLASSES[columns])}>
          {images.map(({ src, width, height }) => (
            <div
              key={src}
              className="mb-3 break-inside-avoid overflow-hidden rounded-md border border-white/20 bg-white/5 sm:mb-4"
            >
              <Image
                src={src}
                alt=""
                width={width}
                height={height}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
