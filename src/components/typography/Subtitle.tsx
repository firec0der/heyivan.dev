import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/cn';

export function Subtitle({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <p className={cn('text-[18px] leading-[150%] text-[color:var(--color-text-muted)]', className)}>
      {children}
    </p>
  );
}
