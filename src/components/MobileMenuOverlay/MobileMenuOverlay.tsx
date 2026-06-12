'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { IconButton } from '@/components/IconButton';
import { isActiveRoute, NAV_LINKS } from '@/components/Nav/links';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/cn';

type Props = {
  open: boolean;
  onClose: () => void;
  wordmark: string;
};

export const MobileMenuOverlay = ({ open, onClose, wordmark }: Props) => {
  const pathname = usePathname() ?? '/';

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
      aria-label="Site navigation"
      className="bg-canvas px-lg pt-lg fixed inset-0 z-40 flex flex-col"
    >
      <div className="flex items-center justify-between">
        <span className="text-fg text-[16px] font-medium">{wordmark}</span>
        <IconButton onClick={onClose} aria-label="Close menu">
          ×
        </IconButton>
      </div>

      <nav aria-label="Primary" className="mt-3xl gap-lg flex flex-col">
        {NAV_LINKS.map(({ href, label }) => {
          const active = isActiveRoute(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              aria-current={active ? 'page' : undefined}
              className={cn('text-[28px] font-medium', active ? 'text-fg' : 'text-muted')}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-border mt-3xl pt-lg flex items-center justify-between border-t">
        <span className="text-muted text-[14px]">Theme</span>
        <ThemeToggle />
      </div>
    </div>
  );
};
