import { notFound } from "next/navigation";
import Image from "next/image";
import { compileMDX } from "next-mdx-remote/rsc";
import { Menu } from "@/components/navigation/menu";
import { Subcaption } from "@/components/subcaption";
import { formatBlogDate, getAllBlogSlugs, getBlogPostSource } from "@/lib/blog";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const source = getBlogPostSource(slug);
  if (!source) notFound();

  const { content, frontmatter } = await compileMDX({
    source,
    options: { parseFrontmatter: true },
  });

  return (
    <>
      <Menu />
      <article className="w-full bg-background px-6 pb-20 pt-28 sm:px-16 sm:pt-36">
        <div className="mx-auto max-w-2xl">
          <Subcaption>{formatBlogDate(frontmatter.date)}</Subcaption>
          <h1 className="mt-2 text-white">{frontmatter.title}</h1>

          {frontmatter.image && (
            <div className="relative mt-8 aspect-3/2 w-full overflow-hidden rounded-lg border border-white/15 bg-white/5">
              <Image
                src={frontmatter.image}
                alt=""
                fill
                sizes="(min-width: 640px) 60vw, 90vw"
                className="object-cover"
              />
            </div>
          )}

          <div className="mt-10 flex flex-col gap-5">{content}</div>
        </div>
      </article>
    </>
  );
}
