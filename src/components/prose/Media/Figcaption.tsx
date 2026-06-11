import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLElement>;

export const Figcaption = ({ children, className, ...rest }: Props) => (
  <figcaption {...rest} className={cn('text-muted text-[13px] leading-[1.6]', className)}>
    {children}
  </figcaption>
);
