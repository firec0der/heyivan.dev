'use client';

import { IconButton } from '@/components/IconButton';
import { type ClassName, cn } from '@/lib/cn';
import { useTheme } from '@/lib/theme/use-theme';

export const ThemeToggle = ({ className }: ClassName) => {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <IconButton
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn('hover:text-fg rounded-full transition-colors', className)}
    >
      <span aria-hidden="true">{isDark ? '☼' : '☽'}</span>
    </IconButton>
  );
};
