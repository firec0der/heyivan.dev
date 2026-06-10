import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLAnchorElement> & { href?: string };

export const A = ({ children, className, href, ...rest }: Props) => (
  <a
    {...rest}
    href={href}
    className={cn('text-accent underline underline-offset-[2px] hover:no-underline', className)}
  >
    {children}
  </a>
);
