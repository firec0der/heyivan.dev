import type { PropsWithChildren } from 'react';

import { type ClassName, cn } from '@/lib/cn';

export const DetailTitle = ({ children, className }: PropsWithChildren & ClassName) => (
  <h1 className={cn('text-fg font-serif text-[34px] leading-[1.25] font-semibold', className)}>
    {children}
  </h1>
);
