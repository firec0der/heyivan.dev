import type { PropsWithChildren } from 'react';

import { type ClassName, cn } from '@/lib/cn';

export const MonoText = ({ children, className }: PropsWithChildren & ClassName) => (
  <span className={cn('text-faint font-mono text-[13px] leading-[1.5]', className)}>
    {children}
  </span>
);
