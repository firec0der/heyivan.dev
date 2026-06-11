import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote-client/rsc';

import { getArticleBySlug, getArticleSlugs } from '@/lib/content/articles';
import { mdxComponents } from '@/lib/content/mdx-components';
import { mdxOptions } from '@/lib/content/mdx-options';

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<Params> };

const ArticlePage = async ({ params }: Props) => {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <article>
      <header>
        <h1 className="text-fg font-serif text-[34px] leading-[1.25] font-semibold">
          {article.title}
        </h1>
        <p className="text-muted mt-sm font-mono text-[13px] leading-[1.5]">
          <time dateTime={article.date}>{article.date}</time>
          {' · '}
          {article.readingTimeMinutes} min read
        </p>
      </header>
      <MDXRemote
        source={article.body}
        components={mdxComponents}
        options={{ mdxOptions, parseFrontmatter: false }}
      />
    </article>
  );
};

export default ArticlePage;
