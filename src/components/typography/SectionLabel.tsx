import type { PropsWithChildren } from 'react';

import { type ClassName, cn } from '@/lib/cn';

export const SectionLabel = ({ children, className }: PropsWithChildren & ClassName) => (
  <p className={cn('text-muted text-[12px] font-medium tracking-[1.2px] uppercase', className)}>
    {children}
  </p>
);
