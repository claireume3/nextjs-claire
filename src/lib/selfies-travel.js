import fs from "fs";
import path from "path";
import matter from "gray-matter";
import sharp from "sharp";

const POSTS_DIR = path.join(process.cwd(), "src/content/selfies-travel");
const PUBLIC_DIR = path.join(process.cwd(), "public");

function shuffle(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Reads every post markdown file — each post can carry multiple photos
// (frontmatter `images`), a seed like count, and a caption (the body).
// Each image's real dimensions are read (same sharp-based approach as
// src/lib/gallery.js) so the post modal can show it at its original
// aspect ratio instead of forcing a square crop. Order is shuffled
// instead of sorted by filename, so the grid doesn't always read the
// same way.
export async function getSelfiesTravelPosts() {
  const filenames = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

  const posts = await Promise.all(
    filenames.map(async (filename) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
      const { data, content } = matter(raw);
      const imagePaths = data.images || [];

      const images = await Promise.all(
        imagePaths.map(async (src) => {
          const { width, height } = await sharp(path.join(PUBLIC_DIR, src)).metadata();
          return { src, width, height };
        })
      );

      return {
        id: filename.replace(/\.md$/, ""),
        images,
        likes: data.likes || 0,
        caption: content.trim(),
      };
    })
  );

  return shuffle(posts);
}
