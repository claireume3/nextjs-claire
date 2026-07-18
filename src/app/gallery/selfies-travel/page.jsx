import { GalleryPage } from "@/components/gallery-page";
import { getGalleryImages } from "@/lib/gallery";

export default async function SelfiesTravelGalleryPage() {
  const images = await getGalleryImages("photography");

  return (
    <GalleryPage
      title="Selfies + Travel"
      caption="On the road, behind the scenes, and everywhere in between."
      images={images}
    />
  );
}
