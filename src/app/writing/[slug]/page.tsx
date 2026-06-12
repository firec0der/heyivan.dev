import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BackLink } from '@/components/BackLink';
import { Container } from '@/components/Container';
import { DetailTitle } from '@/components/DetailTitle';
import { MonoText } from '@/components/MonoText';
import { getArticleBySlug, getArticleSlugs } from '@/lib/content/articles';
import { MdxBody } from '@/lib/content/mdx-body';
import { formatArticleDate } from '@/lib/format';

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
      <BackLink href="/writing">All writing</BackLink>

      <header className="pb-xl">
        <DetailTitle>{article.title}</DetailTitle>
        <MonoText className="text-muted mt-xs block">
          <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
          {' · '}
          {article.readingTimeMinutes} min read
        </MonoText>
      </header>

      <MdxBody source={article.body} />
    </Container>
  );
};

export default ArticlePage;
