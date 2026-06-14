import type { ComponentProps } from 'react';

import { type ClassName, cn } from '@/lib/cn';

type Props = Omit<ComponentProps<'a'>, 'className'> & ClassName;

export const A = ({ children, className, href, ...rest }: Props) => (
  <a
    {...rest}
    href={href}
    className={cn('text-accent underline underline-offset-[2px] hover:no-underline', className)}
  >
    {children}
  </a>
);
