import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('text-[18px] font-semibold', className)}>{children}</h3>;
}
