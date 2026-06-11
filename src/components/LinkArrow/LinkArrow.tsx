import Link from 'next/link';
import type { PropsWithChildren } from 'react';

import { type ClassName, cn } from '@/lib/cn';

type Direction = 'forward' | 'back';

type Props = PropsWithChildren<{
  href: string;
  direction?: Direction;
  external?: boolean;
}> &
  ClassName;

export const LinkArrow = ({
  href,
  direction = 'forward',
  external = false,
  children,
  className
}: Props) => {
  const content = (
    <>
      {direction === 'back' ? <span aria-hidden="true">←</span> : null}
      <span>{children}</span>
      {direction === 'forward' ? <span aria-hidden="true">→</span> : null}
    </>
  );

  const classes = cn(
    'text-accent inline-flex items-center gap-3xs underline-offset-2 hover:underline',
    className
  );

  return external ? (
    <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
};
