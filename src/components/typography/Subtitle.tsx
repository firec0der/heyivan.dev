import type { PropsWithChildren } from 'react';

import { type ClassName, cn } from '@/lib/cn';

export const Subtitle = ({ children, className }: PropsWithChildren & ClassName) => (
  <p className={cn('text-[18px] leading-[150%] text-[color:var(--color-text-muted)]', className)}>
    {children}
  </p>
);
