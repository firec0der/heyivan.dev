import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLQuoteElement>;

export const Blockquote = ({ children, className, ...rest }: Props) => (
  <blockquote
    {...rest}
    className={cn('text-muted mb-lg border-border pl-md border-l-2 font-serif italic', className)}
  >
    {children}
  </blockquote>
);
