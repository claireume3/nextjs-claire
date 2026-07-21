import { InstagramGallery } from "@/components/instagram-gallery";
import { getSelfiesTravelPosts } from "@/lib/selfies-travel";

// Forces this page to render per-request instead of once at build time,
// so the shuffled post order in getSelfiesTravelPosts() is actually fresh
// on every visit instead of baked in permanently by static generation.
export const dynamic = "force-dynamic";

export default function SelfiesTravelGalleryPage() {
  const posts = getSelfiesTravelPosts();

  return <InstagramGallery posts={posts} />;
}
