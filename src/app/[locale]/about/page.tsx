import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { alternatesFor } from '@/lib/i18n/metadata';
import { AboutView } from '@/views/AboutView';

type Props = { params: Promise<{ locale: Locale }> };

export function generateMetadata(): Metadata {
  return { title: 'About', alternates: alternatesFor('/about') };
}

const AboutPage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutView lang={locale} />;
};

export default AboutPage;
