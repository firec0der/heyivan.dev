import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLElement>;

export const Del = ({ children, className, ...rest }: Props) => (
  <del {...rest} className={cn('text-muted line-through', className)}>
    {children}
  </del>
);
