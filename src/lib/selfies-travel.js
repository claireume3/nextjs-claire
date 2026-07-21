import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "src/content/selfies-travel");

// Reads every post markdown file — each post can carry multiple photos
// (frontmatter `images`), a seed like count, and a caption (the body).
export function getSelfiesTravelPosts() {
  const filenames = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

  return filenames
    .map((filename) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
      const { data, content } = matter(raw);
      return {
        id: filename.replace(/\.md$/, ""),
        images: data.images || [],
        likes: data.likes || 0,
        caption: content.trim(),
      };
    })
    .sort((a, b) => b.id.localeCompare(a.id));
}
