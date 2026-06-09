import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type LabelProps = PropsWithChildren & ClassName & HTMLPassThrough<HTMLSpanElement>;

export const Label = ({ children, className, ...rest }: LabelProps) => (
  <span
    {...rest}
    className={cn('text-muted text-[10px] font-medium tracking-[1px] uppercase', className)}
  >
    {children}
  </span>
);
