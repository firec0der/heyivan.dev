import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLTableCellElement>;

export const Td = ({ children, className, ...rest }: Props) => (
  <td
    {...rest}
    className={cn('text-fg p-sm font-serif text-[16px] leading-[1.75] md:text-[17px]', className)}
  >
    {children}
  </td>
);
