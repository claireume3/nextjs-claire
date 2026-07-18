import { Carousel } from "@/components/carousel";
import { HeroBackground } from "@/components/hero-background";
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

      <HeroBackground src="/images/professional/IMG_1324.JPG" alt="Claire Umezawa" />

      <section className="relative w-full aspect-square sm:aspect-auto sm:h-screen">
        <Menu />

        <div className="relative flex h-full items-center justify-center px-6 pt-16 sm:pt-24">
          <HeroCaption />
        </div>
      </section>

      <div
        className="relative flex flex-col flex-1 items-center justify-center font-sans [--fade:6rem] mt-[calc(-1*var(--fade))] sm:pt-10 sm:[--fade:12rem]"
        style={{ background: "linear-gradient(to bottom, transparent, var(--background) var(--fade))" }}
      >
      <Reveal direction="up">
        <Carousel slides={slides} />
      </Reveal>
      </div>

      <div className="w-full bg-background">
        <PhotoCollage />
        <ModelStats />
      </div>
    </>
  );
}
