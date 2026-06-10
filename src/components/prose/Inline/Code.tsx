import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLElement>;

export const Code = ({ children, className, ...rest }: Props) => (
  <code
    {...rest}
    className={cn('bg-surface text-mono-code rounded-sm px-1.5 py-[1px] font-mono', className)}
  >
    {children}
  </code>
);
