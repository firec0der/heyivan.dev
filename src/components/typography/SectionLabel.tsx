import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'text-[12px] font-medium tracking-[1.2px] text-[color:var(--color-text-muted)] uppercase',
        className
      )}
    >
      {children}
    </p>
  );
}
