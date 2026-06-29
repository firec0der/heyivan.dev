import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'uk'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export type Locale = (typeof routing.locales)[number];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
