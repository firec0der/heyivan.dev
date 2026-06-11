'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { MobileMenuOverlay } from '@/components/MobileMenuOverlay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { type ClassName, cn } from '@/lib/cn';

import { isActiveRoute, NAV_LINKS } from './links';

type Props = { wordmark: string } & ClassName;

export const Nav = ({ wordmark, className }: Props) => {
  const pathname = usePathname() ?? '/';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={cn('border-border border-b', className)}>
      <div className="px-lg py-md md:px-4xl mx-auto flex w-full max-w-[1440px] items-center justify-between">
        <Link href="/" className="text-fg text-[16px] font-medium">
          {wordmark}
        </Link>

        <nav aria-label="Primary" className="gap-xl hidden items-center md:flex">
          {NAV_LINKS.map(({ href, label }) => {
            const active = isActiveRoute(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'text-[14px] transition-colors',
                  active ? 'text-fg' : 'text-faint hover:text-muted'
                )}
              >
                {label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>

        <div className="gap-2xs flex items-center md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="text-muted inline-flex size-[36px] items-center justify-center text-[22px]"
          >
            ☰
          </button>
        </div>
      </div>

      <MobileMenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} wordmark={wordmark} />
    </header>
  );
};
