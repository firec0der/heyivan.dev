import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLTableSectionElement>;

export const Thead = ({ children, className, ...rest }: Props) => (
  <thead {...rest} className={cn('border-border border-b', className)}>
    {children}
  </thead>
);
