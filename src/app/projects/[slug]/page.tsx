import type { Metadata } from 'next';

import { getProjectBySlug, getProjectSlugs } from '@/lib/content/projects';
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
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    alternates: alternatesFor(`/projects/${slug}`),
    openGraph: { title: project.title, description: project.tagline }
  };
};

const ProjectDetailPage = async ({ params }: Props) => {
  const { slug } = await params;
  return <ProjectView lang="en" slug={slug} />;
};

export default ProjectDetailPage;
