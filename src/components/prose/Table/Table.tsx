import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLTableElement>;

export const Table = ({ children, className, ...rest }: Props) => (
  <table {...rest} className={cn('mb-lg w-full border-collapse', className)}>
    {children}
  </table>
);
