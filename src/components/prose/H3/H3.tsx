import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLHeadingElement>;

export const H3 = ({ children, className, ...rest }: Props) => (
  <h3
    {...rest}
    className={cn(
      'text-fg text-prose-h3 leading-prose-h3 mt-xl mb-2xs font-serif font-semibold',
      className
    )}
  >
    {children}
  </h3>
);
