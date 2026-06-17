export const LOCALES = ['en', 'uk'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/** Derive the locale from a pathname. Anything under `/uk` is Ukrainian; everything else is English. */
export const localeFromPath = (pathname: string): Locale =>
  pathname === '/uk' || pathname.startsWith('/uk/') ? 'uk' : 'en';

/** Map a pathname to its equivalent in `locale`, adding or removing the `/uk` prefix. */
export const localizePath = (pathname: string, locale: Locale): string => {
  const base =
    pathname === '/uk' ? '/' : pathname.startsWith('/uk/') ? pathname.slice(3) : pathname;
  if (locale === 'en') return base;
  return base === '/' ? '/uk' : `/uk${base}`;
};
