import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "src/content/selfies-travel");

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
// Order is shuffled (same approach as src/lib/gallery.js) instead of
// sorted by filename, so the grid doesn't always read the same way.
export function getSelfiesTravelPosts() {
  const filenames = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

  const posts = filenames.map((filename) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
    const { data, content } = matter(raw);
    return {
      id: filename.replace(/\.md$/, ""),
      images: data.images || [],
      likes: data.likes || 0,
      caption: content.trim(),
    };
  });

  return shuffle(posts);
}
