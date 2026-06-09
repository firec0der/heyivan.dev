import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/cn';

export const PageTitle = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <h1 className={cn('text-[28px] leading-[130%] font-semibold', className)}>{children}</h1>
);
