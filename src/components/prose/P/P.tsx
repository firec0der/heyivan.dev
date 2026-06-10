import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLParagraphElement>;

export const P = ({ children, className, ...rest }: Props) => (
  <p {...rest} className={cn('text-fg text-prose leading-prose mb-lg font-serif', className)}>
    {children}
  </p>
);
