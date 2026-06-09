import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/cn';

export const Meta = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <span className={cn('font-mono text-[13px] text-[color:var(--color-text-faint)]', className)}>
    {children}
  </span>
);
