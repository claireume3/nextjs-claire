import { LinksBackground } from "@/components/links-background";
import { LinksList } from "@/components/links-list";
import { ProfileCircle } from "@/components/profile-circle";

const NAME = "Claire Umezawa";

export default function LinksPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center px-6">
      <LinksBackground
        portraitSrc="/images/photography/5AF31B8A-67B1-4522-94F8-9F5A1CE2B0F9-32505-0000047935762B5A_VSCO.JPG"
        landscapeSrc="/images/photography/IMG_8497.JPG"
      />

      <ProfileCircle photoSrc="/images/professional/IMG_1324.JPG" photoAlt={NAME} />

      <LinksList />
    </div>
  );
}
