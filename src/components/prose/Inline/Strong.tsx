import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLElement>;

export const Strong = ({ children, className, ...rest }: Props) => (
  <strong {...rest} className={cn('font-semibold', className)}>
    {children}
  </strong>
);
