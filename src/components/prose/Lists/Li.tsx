import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLLIElement>;

export const Li = ({ children, className, ...rest }: Props) => (
  <li {...rest} className={cn('text-fg mb-2xs font-serif text-[17px] leading-[1.75]', className)}>
    {children}
  </li>
);
