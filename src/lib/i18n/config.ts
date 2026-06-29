export type { Locale } from '@/i18n/routing';

export const localizePath = (pathname: string, locale: string): string =>
  `/${locale}${pathname === '/' ? '' : pathname}`;
