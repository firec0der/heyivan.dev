'use client';

import { useLocale } from 'next-intl';
import { useEffect } from 'react';

import { IconButton } from '@/components/IconButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { isActiveRoute, NAV_LINKS } from '@/components/Nav/links';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link, usePathname } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import { cn } from '@/lib/cn';
import { getDictionary } from '@/lib/i18n/dictionaries';

type Props = {
  open: boolean;
  onClose: () => void;
  wordmark: string;
};

export const MobileMenuOverlay = ({ open, onClose, wordmark }: Props) => {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const t = getDictionary(locale);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.menu.nav}
      className="bg-canvas px-lg pt-lg fixed inset-0 z-40 flex flex-col"
    >
      <div className="flex items-center justify-between">
        <span className="text-fg text-[16px] font-medium">{wordmark}</span>
        <IconButton onClick={onClose} aria-label={t.menu.close}>
          ×
        </IconButton>
      </div>

      <nav aria-label="Primary" className="mt-3xl gap-lg flex flex-col">
        {NAV_LINKS.map(({ href, key }) => {
          const active = isActiveRoute(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              aria-current={active ? 'page' : undefined}
              className={cn('text-[28px] font-medium', active ? 'text-fg' : 'text-muted')}
            >
              {t.nav[key]}
            </Link>
          );
        })}
      </nav>

      <div className="border-border mt-3xl pt-lg flex items-center justify-between border-t">
        <span className="text-muted text-[14px]">{t.language.label}</span>
        <LanguageSwitcher />
      </div>

      <div className="border-border mt-lg pt-lg flex items-center justify-between border-t">
        <span className="text-muted text-[14px]">{t.theme.label}</span>
        <ThemeToggle />
      </div>
    </div>
  );
};
