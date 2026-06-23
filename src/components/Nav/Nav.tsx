'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';

import { IconButton } from '@/components/IconButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { MobileMenuOverlay } from '@/components/MobileMenuOverlay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { type ClassName, cn } from '@/lib/cn';
import { localeFromPath, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

import { isActiveRoute, NAV_LINKS } from './links';

type Props = { wordmark: string } & ClassName;

export const Nav = ({ wordmark, className }: Props) => {
  const pathname = usePathname() ?? '/';
  const locale = localeFromPath(pathname);
  const t = getDictionary(locale);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuClose = useCallback(() => setMenuOpen(false), []);

  return (
    <header className={cn('border-border border-b', className)}>
      <div className="px-lg py-md md:px-4xl mx-auto flex w-full max-w-[1440px] items-center justify-between">
        <Link href={localizePath('/', locale)} className="text-fg text-[16px] font-medium">
          {wordmark}
        </Link>

        <nav aria-label="Primary" className="gap-xl hidden items-center md:flex">
          {NAV_LINKS.map(({ href, key }) => {
            const localizedHref = localizePath(href, locale);
            const active = isActiveRoute(pathname, localizedHref);
            return (
              <Link
                key={href}
                href={localizedHref}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'text-[14px] transition-colors',
                  active ? 'text-fg' : 'text-faint hover:text-muted'
                )}
              >
                {t.nav[key]}
              </Link>
            );
          })}
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>

        <div className="gap-2xs flex items-center md:hidden">
          <ThemeToggle />
          <IconButton
            onClick={() => setMenuOpen(true)}
            aria-label={t.menu.open}
            aria-expanded={menuOpen}
          >
            ☰
          </IconButton>
        </div>
      </div>

      <MobileMenuOverlay open={menuOpen} onClose={handleMenuClose} wordmark={wordmark} />
    </header>
  );
};
