import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLLIElement>;

export const Li = ({ children, className, ...rest }: Props) => (
  <li
    {...rest}
    className={cn('text-fg mb-2xs font-serif text-[16px] leading-[1.75] md:text-[17px]', className)}
  >
    {children}
  </li>
);
