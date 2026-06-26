import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { alternatesFor } from '@/lib/i18n/metadata';
import { WritingIndexView } from '@/views/WritingIndexView';
import { type Locale } from '@/i18n/routing';

type Props = { params: Promise<{ locale: Locale }> };

export function generateMetadata(): Metadata {
  return { title: 'Writing', alternates: alternatesFor('/writing') };
}

const WritingPage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <WritingIndexView lang={locale} />;
};

export default WritingPage;
