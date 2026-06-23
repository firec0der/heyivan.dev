import type { Metadata } from 'next';

import { getProjectSlugs } from '@/lib/content/projects';
import { alternatesFor } from '@/lib/i18n/metadata';
import { ProjectView } from '@/views/ProjectView';

type Params = { slug: string };
type Props = { params: Promise<Params> };

export const dynamicParams = false;

export const generateStaticParams = async (): Promise<Params[]> => {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  return { alternates: alternatesFor(`/projects/${slug}`) };
};

const UkProjectDetailPage = async ({ params }: Props) => {
  const { slug } = await params;
  return <ProjectView lang="uk" slug={slug} />;
};

export default UkProjectDetailPage;
