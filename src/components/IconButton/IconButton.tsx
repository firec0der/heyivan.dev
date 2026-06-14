import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren<HTMLPassThrough<HTMLButtonElement>> & ClassName;

export const IconButton = ({ children, className, ...rest }: Props) => (
  <button
    type="button"
    className={cn(
      'text-muted inline-flex size-[36px] cursor-pointer items-center justify-center text-[22px]',
      className
    )}
    {...rest}
  >
    {children}
  </button>
);
