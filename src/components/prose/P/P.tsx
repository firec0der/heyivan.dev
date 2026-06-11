import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLParagraphElement>;

export const P = ({ children, className, ...rest }: Props) => (
  <p {...rest} className={cn('text-fg mb-lg font-serif text-[17px] leading-[1.75]', className)}>
    {children}
  </p>
);
