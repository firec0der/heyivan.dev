import type { PropsWithChildren } from 'react';

import { type ClassName, cn } from '@/lib/cn';

export const CardTitle = ({ children, className }: PropsWithChildren & ClassName) => (
  <h3 className={cn('text-card font-semibold', className)}>{children}</h3>
);
