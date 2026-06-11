import type { PropsWithChildren } from 'react';

import { type ClassName, cn } from '@/lib/cn';

export const Subtitle = ({ children, className }: PropsWithChildren & ClassName) => (
  <p className={cn('text-muted text-body-large leading-body-large', className)}>{children}</p>
);
