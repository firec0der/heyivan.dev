import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLHeadingElement>;

export const H3 = ({ children, className, ...rest }: Props) => (
  <h3
    {...rest}
    className={cn(
      'text-fg mt-xl mb-2xs font-serif text-[18px] leading-[1.4] font-semibold',
      className
    )}
  >
    {children}
  </h3>
);
