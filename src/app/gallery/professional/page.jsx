import { GalleryPage } from "@/components/gallery-page";
import { getGalleryImages } from "@/lib/gallery";

export default async function ProfessionalGalleryPage() {
  const images = await getGalleryImages("professional");

  return (
    <GalleryPage
      title="Professional"
      caption="Editorial and studio work."
      images={images}
      columns={3}
      banner="/images/professional/IMG_1295.jpeg"
    />
  );
}
