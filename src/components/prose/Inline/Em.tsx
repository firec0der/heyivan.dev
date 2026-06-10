import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLElement>;

export const Em = ({ children, className, ...rest }: Props) => (
  <em {...rest} className={cn('italic', className)}>
    {children}
  </em>
);
