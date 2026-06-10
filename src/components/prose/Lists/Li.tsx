import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLLIElement>;

export const Li = ({ children, className, ...rest }: Props) => (
  <li {...rest} className={cn('text-fg text-prose leading-prose mb-2xs font-serif', className)}>
    {children}
  </li>
);
