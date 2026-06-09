import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/cn';

export function Label({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <span
      className={cn(
        'text-[10px] font-medium tracking-[1px] text-[color:var(--color-text-muted)] uppercase',
        className
      )}
    >
      {children}
    </span>
  );
}
