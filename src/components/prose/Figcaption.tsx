import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLElement>;

export const Figcaption = ({ children, className, ...rest }: Props) => (
  <figcaption
    {...rest}
    className={cn('text-muted text-caption leading-caption text-center', className)}
  >
    {children}
  </figcaption>
);
