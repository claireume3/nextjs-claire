import { InstagramGallery } from "@/components/instagram-gallery";
import { getSelfiesTravelPosts } from "@/lib/selfies-travel";

export default function SelfiesTravelGalleryPage() {
  const posts = getSelfiesTravelPosts();

  return <InstagramGallery posts={posts} />;
}
