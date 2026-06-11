import type { PropsWithChildren } from 'react';

import { type ClassName, cn } from '@/lib/cn';

export const MonoText = ({ children, className }: PropsWithChildren & ClassName) => (
  <span className={cn('text-faint text-mono-date leading-mono-date font-mono', className)}>
    {children}
  </span>
);
