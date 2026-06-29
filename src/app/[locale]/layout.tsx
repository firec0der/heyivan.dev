import '../globals.css';

import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { PropsWithChildren } from 'react';

import { Footer } from '@/components/Footer';
import { Nav } from '@/components/Nav';
import { SkipLink } from '@/components/SkipLink';
import { type Locale, routing } from '@/i18n/routing';
import { cn } from '@/lib/cn';
import { getSiteData } from '@/lib/content/site';
import { THEME_INIT_SCRIPT } from '@/lib/theme/init-script';

import { mono, sans, serif } from '../fonts';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL('https://heyivan.dev'),
  title: {
    default: 'Ivan Stetsenko',
    template: '%s · Ivan Stetsenko'
  },
  description: 'Personal site of Ivan Stetsenko — software engineer.',
  openGraph: {
    type: 'website',
    siteName: 'Ivan Stetsenko'
  },
  twitter: { card: 'summary_large_image' }
};

const LocaleLayout = async ({
  children,
  params
}: PropsWithChildren<{ params: Promise<{ locale: Locale }> }>) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getSiteData();

  return (
    <html
      lang={locale}
      className={cn(sans.variable, serif.variable, mono.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col" suppressHydrationWarning>
        <NextIntlClientProvider>
          <SkipLink />
          <Nav wordmark={site.wordmark} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer socialLinks={site.social} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;
