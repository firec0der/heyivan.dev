import { getArticleSlugs } from '@/lib/content/articles';
import { ArticleView } from '@/views/ArticleView';

type Params = { slug: string };
type Props = { params: Promise<Params> };

export const dynamicParams = false;

export const generateStaticParams = async (): Promise<Params[]> => {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
};

const UkArticlePage = async ({ params }: Props) => {
  const { slug } = await params;
  return <ArticleView lang="uk" slug={slug} />;
};

export default UkArticlePage;
