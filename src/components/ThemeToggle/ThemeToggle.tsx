'use client';

import { type ClassName, cn } from '@/lib/cn';
import { useTheme } from '@/lib/theme/use-theme';

export const ThemeToggle = ({ className }: ClassName) => {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'text-muted hover:text-fg inline-flex size-[36px] items-center justify-center rounded-full text-[22px] transition-colors',
        className
      )}
    >
      <span aria-hidden="true">{isDark ? '☼' : '☽'}</span>
    </button>
  );
};
