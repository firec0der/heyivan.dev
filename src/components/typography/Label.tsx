import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type LabelProps = PropsWithChildren & ClassName & HTMLPassThrough<HTMLSpanElement>;

export const Label = ({ children, className, ...rest }: LabelProps) => (
  <span
    {...rest}
    className={cn(
      'text-[10px] font-medium tracking-[1px] text-[color:var(--color-text-muted)] uppercase',
      className
    )}
  >
    {children}
  </span>
);
