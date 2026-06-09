import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export function Subtitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-[18px] leading-[150%] text-[color:var(--color-text-muted)]', className)}>
      {children}
    </p>
  );
}
