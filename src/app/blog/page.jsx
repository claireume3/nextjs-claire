import Image from "next/image";
import Link from "next/link";
import { AnimatedParagraph } from "@/components/animated-paragraph";
import { Menu } from "@/components/navigation/menu";
import { Subcaption } from "@/components/subcaption";
import { formatBlogDate, getAllBlogPosts } from "@/lib/blog";

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <Menu />
      <section className="w-full bg-background px-6 pb-20 pt-28 sm:px-16 sm:pt-36">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-white">Blog</h1>
          <AnimatedParagraph className="mx-auto mt-3 max-w-lg">
            Notes from behind the scenes — travel, style, and everything in
            between.
          </AnimatedParagraph>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-2">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col gap-4">
              <div className="relative aspect-3/2 w-full overflow-hidden rounded-lg border border-white/15 bg-white/5">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <Subcaption>{formatBlogDate(post.date)}</Subcaption>
                <h3 className="mt-1 text-white transition-opacity group-hover:opacity-70">
                  {post.title}
                </h3>
                <AnimatedParagraph className="mt-1 text-white/70">{post.excerpt}</AnimatedParagraph>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
