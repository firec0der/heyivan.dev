'use client';

import { useLocale } from 'next-intl';

import { IconButton } from '@/components/IconButton';
import { type Locale } from '@/i18n/routing';
import { type ClassName, cn } from '@/lib/cn';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { useTheme } from '@/lib/theme/use-theme';

export const ThemeToggle = ({ className }: ClassName) => {
  const { theme, toggle } = useTheme();
  const t = getDictionary(useLocale() as Locale);
  const isDark = theme === 'dark';
  return (
    <IconButton
      onClick={toggle}
      aria-label={isDark ? t.theme.toLight : t.theme.toDark}
      className={cn('hover:text-fg rounded-full transition-colors', className)}
    >
      <span aria-hidden="true">{isDark ? '☼' : '☽'}</span>
    </IconButton>
  );
};
