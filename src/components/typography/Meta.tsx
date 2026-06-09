import type { PropsWithChildren } from 'react';

import { type ClassName, cn } from '@/lib/cn';

export const Meta = ({ children, className }: PropsWithChildren & ClassName) => (
  <span className={cn('font-mono text-[13px] text-[color:var(--color-text-faint)]', className)}>
    {children}
  </span>
);
