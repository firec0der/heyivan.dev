import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getArticleSlugs } from '@/lib/content/articles';
import { alternatesFor } from '@/lib/i18n/metadata';
import { ArticleView } from '@/views/ArticleView';

type Params = { slug: string };
type Props = { params: Promise<Params> };

export const dynamicParams = false;

export const generateStaticParams = async (): Promise<Params[]> => {
  const slugs = await getArticleSlugs();
  if (slugs.length === 0) return [{ slug: '_empty' }];
  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  return { alternates: alternatesFor(`/writing/${slug}`) };
};

const UkArticlePage = async ({ params }: Props) => {
  const { slug } = await params;
  if (slug === '_empty') notFound();
  return <ArticleView lang="uk" slug={slug} />;
};

export default UkArticlePage;
