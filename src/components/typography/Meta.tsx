import type { PropsWithChildren } from 'react';

import { type ClassName, cn } from '@/lib/cn';

export const Meta = ({ children, className }: PropsWithChildren & ClassName) => (
  <span className={cn('text-faint font-mono text-[13px]', className)}>{children}</span>
);
