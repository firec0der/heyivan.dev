'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Chevron } from '@/components/Chevron';
import { type ClassName, cn } from '@/lib/cn';
import { type Locale, localeFromPath, LOCALES, localizePath } from '@/lib/i18n/config';

const LABELS: Record<Locale, string> = { en: 'en', uk: 'укр' };

export const LanguageSwitcher = ({ className }: ClassName) => {
  const pathname = usePathname() ?? '/';
  const active = localeFromPath(pathname);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="text-fg gap-2xs flex cursor-pointer items-center text-[14px]"
      >
        {LABELS[active]}
        <Chevron open={open} className="text-muted size-[16px]" />
      </button>

      {open && (
        <ul className="border-border bg-canvas gap-3xs p-2xs mt-2xs absolute top-full right-0 z-50 flex list-none flex-col rounded-md border">
          {LOCALES.map((locale) => (
            <li key={locale}>
              <Link
                href={localizePath(pathname, locale)}
                aria-current={locale === active ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  'px-2xs block text-[14px]',
                  locale === active ? 'text-fg' : 'text-muted hover:text-fg'
                )}
              >
                {LABELS[locale]}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
