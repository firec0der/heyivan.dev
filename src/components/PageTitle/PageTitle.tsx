import type { PropsWithChildren } from 'react';

import { type ClassName, cn } from '@/lib/cn';

export const PageTitle = ({ children, className }: PropsWithChildren & ClassName) => (
  <h1 className={cn('text-[28px] leading-[1.3] font-semibold', className)}>{children}</h1>
);
