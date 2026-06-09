import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export function Label({ children, className }: { children: ReactNode; className?: string }) {
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
