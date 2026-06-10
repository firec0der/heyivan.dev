import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLElement>;

export const Figure = ({ children, className, ...rest }: Props) => (
  <figure {...rest} className={cn('mb-lg gap-2xs flex flex-col [&_img]:my-0', className)}>
    {children}
  </figure>
);
