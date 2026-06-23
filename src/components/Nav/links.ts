import type { Dictionary } from '@/lib/i18n/dictionaries';

export const NAV_LINKS = [
  { href: '/about', key: 'about' },
  { href: '/work', key: 'work' },
  { href: '/projects', key: 'projects' },
  { href: '/writing', key: 'writing' }
] as const satisfies ReadonlyArray<{ href: string; key: keyof Dictionary['nav'] }>;

export const isActiveRoute = (pathname: string, href: string): boolean =>
  pathname === href || pathname.startsWith(href + '/');
