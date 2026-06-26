import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { alternatesFor } from '@/lib/i18n/metadata';
import { HomeView } from '@/views/HomeView';
import { type Locale } from '@/i18n/routing';

type Props = { params: Promise<{ locale: Locale }> };

export function generateMetadata(): Metadata {
  return { alternates: alternatesFor('/') };
}

const HomePage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeView lang={locale} />;
};

export default HomePage;
