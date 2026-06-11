import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLHeadingElement>;

export const H4 = ({ children, className, ...rest }: Props) => (
  <h4
    {...rest}
    className={cn(
      'text-fg mt-lg mb-2xs font-serif text-[16px] leading-[1.4] font-semibold',
      className
    )}
  >
    {children}
  </h4>
);
