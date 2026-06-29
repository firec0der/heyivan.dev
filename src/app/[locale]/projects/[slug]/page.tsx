import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { getProjectBySlug, getProjectSlugs } from '@/lib/content/projects';
import { alternatesFor } from '@/lib/i18n/metadata';
import { ProjectView } from '@/views/ProjectView';

type Params = { locale: Locale; slug: string };
type Props = { params: Promise<Params> };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getProjectSlugs();
  if (slugs.length === 0) return [{ slug: '_empty' }];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    alternates: alternatesFor(`/projects/${slug}`),
    openGraph: { title: project.title, description: project.tagline }
  };
}

const ProjectDetailPage = async ({ params }: Props) => {
  const { locale, slug } = await params;
  if (slug === '_empty') notFound();
  setRequestLocale(locale);
  return <ProjectView lang={locale} slug={slug} />;
};

export default ProjectDetailPage;
