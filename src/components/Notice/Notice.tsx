import type { PropsWithChildren } from 'react';

import { type ClassName, cn } from '@/lib/cn';

export const Notice = ({ children, className }: PropsWithChildren & ClassName) => (
  <p
    className={cn('text-muted border-border px-md py-sm rounded-md border text-[14px]', className)}
  >
    {children}
  </p>
);
