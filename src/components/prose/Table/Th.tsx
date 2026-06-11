import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLTableCellElement>;

export const Th = ({ children, className, ...rest }: Props) => (
  <th
    {...rest}
    className={cn(
      'text-fg p-sm text-left font-serif text-[17px] leading-[1.75] font-semibold',
      className
    )}
  >
    {children}
  </th>
);
