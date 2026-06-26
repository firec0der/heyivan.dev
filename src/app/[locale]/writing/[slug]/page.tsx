import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { getArticleSlugs } from '@/lib/content/articles';
import { alternatesFor } from '@/lib/i18n/metadata';
import { ArticleView } from '@/views/ArticleView';
import { type Locale } from '@/i18n/routing';

type Params = { locale: Locale; slug: string };
type Props = { params: Promise<Params> };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getArticleSlugs();
  if (slugs.length === 0) return [{ slug: '_empty' }];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { alternates: alternatesFor(`/writing/${slug}`) };
}

const ArticlePage = async ({ params }: Props) => {
  const { locale, slug } = await params;
  if (slug === '_empty') notFound();
  setRequestLocale(locale);
  return <ArticleView lang={locale} slug={slug} />;
};

export default ArticlePage;
