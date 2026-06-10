import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLElement>;

export const Kbd = ({ children, className, ...rest }: Props) => (
  <kbd
    {...rest}
    className={cn(
      'border-border bg-surface rounded-sm border px-1.5 py-[1px] font-mono text-[12px]',
      className
    )}
  >
    {children}
  </kbd>
);
