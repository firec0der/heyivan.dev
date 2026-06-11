export const NAV_LINKS = [
  { href: '/about', label: 'about' },
  { href: '/work', label: 'work' },
  { href: '/projects', label: 'projects' },
  { href: '/writing', label: 'writing' }
] as const;

export const isActiveRoute = (pathname: string, href: string): boolean =>
  pathname === href || pathname.startsWith(href + '/');
