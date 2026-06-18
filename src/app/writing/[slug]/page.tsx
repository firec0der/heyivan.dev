import type { Metadata } from 'next';

import { getArticleBySlug, getArticleSlugs } from '@/lib/content/articles';
import { ArticleView } from '@/views/ArticleView';

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
  return <ArticleView lang="en" slug={slug} />;
};

export default ArticlePage;
