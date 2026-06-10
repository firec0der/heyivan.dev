import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLTableRowElement>;

export const Tr = ({ children, className, ...rest }: Props) => (
  <tr {...rest} className={cn('border-border border-b', className)}>
    {children}
  </tr>
);
