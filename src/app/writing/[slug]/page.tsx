import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote-client/rsc';

import { Container } from '@/components/Container';
import { LinkArrow } from '@/components/LinkArrow';
import { getArticleBySlug, getArticleSlugs } from '@/lib/content/articles';
import { mdxComponents } from '@/lib/content/mdx-components';
import { mdxOptions } from '@/lib/content/mdx-options';

type Params = { slug: string };
type Props = { params: Promise<Params> };

export const dynamicParams = false;

export const generateStaticParams = async (): Promise<Params[]> => {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description ?? undefined,
    openGraph: {
      title: article.title,
      description: article.description ?? undefined,
      type: 'article',
      publishedTime: article.date
    }
  };
};

const ArticlePage = async ({ params }: Props) => {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <Container width="article">
      <div className="pt-lg pb-lg">
        <LinkArrow href="/writing" direction="back">
          All writing
        </LinkArrow>
      </div>

      <header className="pb-xl">
        <h1 className="text-fg font-serif text-[34px] leading-[1.25] font-semibold">
          {article.title}
        </h1>
        <p className="text-muted mt-xs font-mono text-[13px] leading-[1.5]">
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
    </Container>
  );
};

export default ArticlePage;
