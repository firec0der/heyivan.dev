import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLUListElement>;

export const Ul = ({ children, className, ...rest }: Props) => (
  <ul {...rest} className={cn('ml-lg mb-lg list-outside list-disc', className)}>
    {children}
  </ul>
);
