import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { alternatesFor } from '@/lib/i18n/metadata';
import { WorkView } from '@/views/WorkView';

type Props = { params: Promise<{ locale: Locale }> };

export function generateMetadata(): Metadata {
  return { title: 'Work', alternates: alternatesFor('/work') };
}

const WorkPage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <WorkView lang={locale} />;
};

export default WorkPage;
