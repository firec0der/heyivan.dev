'use client';

import { IconButton } from '@/components/IconButton';
import { type ClassName, cn } from '@/lib/cn';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { useLocale } from '@/lib/i18n/use-locale';
import { useTheme } from '@/lib/theme/use-theme';

export const ThemeToggle = ({ className }: ClassName) => {
  const { theme, toggle } = useTheme();
  const t = getDictionary(useLocale());
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
