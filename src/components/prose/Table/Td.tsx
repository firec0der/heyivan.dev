import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLTableCellElement>;

export const Td = ({ children, className, ...rest }: Props) => (
  <td {...rest} className={cn('text-fg p-sm font-serif text-[17px] leading-[1.75]', className)}>
    {children}
  </td>
);
