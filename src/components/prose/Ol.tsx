import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLOListElement>;

export const Ol = ({ children, className, ...rest }: Props) => (
  <ol {...rest} className={cn('ml-lg mb-lg list-outside list-decimal', className)}>
    {children}
  </ol>
);
