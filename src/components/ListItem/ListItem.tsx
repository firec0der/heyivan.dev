import type { PropsWithChildren } from 'react';

import { type ClassName, cn } from '@/lib/cn';

export const ListItem = ({ children, className }: PropsWithChildren & ClassName) => (
  <li className={cn('border-border border-b last:border-b-0', className)}>{children}</li>
);
