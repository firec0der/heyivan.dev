import type { PropsWithChildren } from 'react';

import { LinkArrow } from '@/components/LinkArrow';
import { type ClassName, cn } from '@/lib/cn';

type Props = PropsWithChildren<{ href: string }> & ClassName;

export const BackLink = ({ href, children, className }: Props) => (
  <div className={cn('pt-lg pb-lg', className)}>
    <LinkArrow href={href} direction="back">
      {children}
    </LinkArrow>
  </div>
);
