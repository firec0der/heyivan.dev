import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLElement>;

export const FootnoteSection = ({ children, className, ...rest }: Props) => (
  <section
    {...rest}
    className={cn(
      'text-muted text-body-small leading-body-small mt-2xl pt-lg border-border border-t',
      className
    )}
  >
    {children}
  </section>
);
