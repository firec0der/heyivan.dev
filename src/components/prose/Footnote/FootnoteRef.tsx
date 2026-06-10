import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLElement>;

export const FootnoteRef = ({ children, className, ...rest }: Props) => (
  <sup {...rest} className={cn('text-accent ml-[2px] text-[10px]', className)}>
    {children}
  </sup>
);
