import { Carousel, CAROUSEL_REVEAL_MS } from "@/components/carousel";
import { HERO_REVEAL_MS, HeroBackground } from "@/components/hero-background";
import { ModelStats } from "@/components/model-stats";
import { HeroCaption } from "@/components/navigation/hero-caption";
import { Menu } from "@/components/navigation/menu";
import { PhotoCollage } from "@/components/photo-collage";
import { PromoPopup } from "@/components/promo-popup";
import { Reveal } from "@/components/reveal";
import { getCarouselSlides } from "@/lib/carousel";

export default function Home() {
  const slides = getCarouselSlides();

  return (
    <>
      <PromoPopup />

      {/* Hero + carousel zone: the hero photo (with the caption and menu
          layered on top of it, same as before) stays pinned to the screen
          (position: sticky) while the carousel scrolls up over it, and
          only lets go once this section runs out — right as the photo
          collage's "Road Unfolds" section begins. Sized exactly like the
          original hero section (aspect-square on mobile, full screen from
          sm up) so the pinned photo's own proportions don't change. */}
      <section className="relative w-full">
        <div className="sticky top-0 aspect-square w-full overflow-hidden sm:aspect-auto sm:h-screen">
          <HeroBackground src="/images/professional/IMG_1324.JPG" alt="Claire Umezawa" />

          <Menu />

          <div className="relative flex h-full items-center justify-center px-6 pt-16 sm:pt-24">
            <HeroCaption />
          </div>
        </div>

        <div
          className="relative flex flex-col flex-1 items-center justify-center font-sans [--fade:6rem] mt-[calc(-1*var(--fade))] sm:pt-10 sm:[--fade:12rem]"
          style={{ background: "linear-gradient(to bottom, transparent, var(--background) var(--fade))" }}
        >
          <Reveal direction="up" mode="mount" delay={HERO_REVEAL_MS} duration={CAROUSEL_REVEAL_MS}>
            <Carousel slides={slides} />
          </Reveal>
        </div>
      </section>

      <div className="relative w-full bg-background">
        <PhotoCollage />
        <ModelStats />
      </div>
    </>
  );
}
