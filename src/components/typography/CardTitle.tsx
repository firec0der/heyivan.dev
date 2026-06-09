import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/cn';

export const CardTitle = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <h3 className={cn('text-[18px] font-semibold', className)}>{children}</h3>
);
