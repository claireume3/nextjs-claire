import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CAROUSEL_DIR = path.join(process.cwd(), "src/content/carousel");
const SLIDE_FILES = ["slide-1.md", "slide-2.md", "slide-3.md"];

export function getCarouselSlides() {
  return SLIDE_FILES.map((filename) => {
    const raw = fs.readFileSync(path.join(CAROUSEL_DIR, filename), "utf8");
    const { data, content } = matter(raw);
    return {
      title: data.title,
      image: data.image,
      reverse: Boolean(data.reverse),
      body: content.trim(),
    };
  });
}
