import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { alternatesFor } from '@/lib/i18n/metadata';
import { ProjectsIndexView } from '@/views/ProjectsIndexView';

type Props = { params: Promise<{ locale: Locale }> };

export function generateMetadata(): Metadata {
  return { title: 'Projects', alternates: alternatesFor('/projects') };
}

const ProjectsPage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProjectsIndexView lang={locale} />;
};

export default ProjectsPage;
