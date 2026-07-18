import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

function getFilenames() {
  return fs.readdirSync(BLOG_DIR).filter((filename) => filename.endsWith(".md"));
}

export function getAllBlogSlugs() {
  return getFilenames().map((filename) => filename.replace(/\.md$/, ""));
}

export function getAllBlogPosts() {
  return getFilenames()
    .map((filename) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
      const { data } = matter(raw);
      return {
        slug: filename.replace(/\.md$/, ""),
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        image: data.image,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getBlogPostSource(slug) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8");
}

export function formatBlogDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
