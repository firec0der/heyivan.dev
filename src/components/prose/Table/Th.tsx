import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLTableCellElement>;

export const Th = ({ children, className, ...rest }: Props) => (
  <th
    {...rest}
    className={cn(
      'text-fg text-prose leading-prose p-sm text-left font-serif font-semibold',
      className
    )}
  >
    {children}
  </th>
);
