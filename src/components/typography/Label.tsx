import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type LabelProps = PropsWithChildren & ClassName & HTMLPassThrough<HTMLSpanElement>;

export const Label = ({ children, className, ...rest }: LabelProps) => (
  <span
    {...rest}
    className={cn(
      'text-muted text-label-pill leading-label-pill tracking-label-pill font-medium uppercase',
      className
    )}
  >
    {children}
  </span>
);
