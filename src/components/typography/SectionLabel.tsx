import type { PropsWithChildren } from 'react';

import { type ClassName, cn } from '@/lib/cn';

export const SectionLabel = ({ children, className }: PropsWithChildren & ClassName) => (
  <p
    className={cn(
      'text-muted text-label-section leading-label-section tracking-label-section font-medium uppercase',
      className
    )}
  >
    {children}
  </p>
);
