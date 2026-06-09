import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export function PageTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h1 className={cn('text-[28px] leading-[130%] font-semibold', className)}>{children}</h1>;
}
