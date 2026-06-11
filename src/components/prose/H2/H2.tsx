import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLHeadingElement>;

export const H2 = ({ children, className, ...rest }: Props) => (
  <h2
    {...rest}
    className={cn(
      'text-fg mt-2xl mb-sm font-serif text-[22px] leading-[1.4] font-semibold',
      className
    )}
  >
    {children}
  </h2>
);
