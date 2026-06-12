import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLParagraphElement>;

export const P = ({ children, className, ...rest }: Props) => (
  <p
    {...rest}
    className={cn('text-fg mb-lg font-serif text-[16px] leading-[1.75] md:text-[17px]', className)}
  >
    {children}
  </p>
);
