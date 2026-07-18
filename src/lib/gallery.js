import fs from "fs";
import path from "path";
import sharp from "sharp";

const IMAGES_DIR = path.join(process.cwd(), "public/images");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".avif", ".webp"]);

function shuffle(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Reads every image directly inside public/images/{folder} — drop a new
// file in and it shows up in the gallery automatically, no code change.
// Each image's real dimensions are read so the gallery can lay them out as
// a true masonry grid instead of a cropped, uniform one. Order is shuffled
// so the layout doesn't always read the same way.
export async function getGalleryImages(folder) {
  const dir = path.join(IMAGES_DIR, folder);
  const filenames = fs
    .readdirSync(dir)
    .filter((filename) => IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase()))
    .sort();

  const images = await Promise.all(
    filenames.map(async (filename) => {
      const { width, height } = await sharp(path.join(dir, filename)).metadata();
      return { src: `/images/${folder}/${filename}`, width, height };
    })
  );

  return shuffle(images);
}
