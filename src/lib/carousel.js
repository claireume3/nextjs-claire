import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CAROUSEL_DIR = path.join(process.cwd(), "src/content/carousel");

export function getCarouselSlides() {
  const slideFiles = fs
    .readdirSync(CAROUSEL_DIR)
    .filter((filename) => filename.endsWith(".md"))
    .sort();

  return slideFiles.map((filename) => {
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
