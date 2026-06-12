import type { PropsWithChildren, ReactNode } from 'react';

import { MonoText } from '@/components/MonoText';
import { type ClassName, cn } from '@/lib/cn';

type Props = PropsWithChildren<{
  /** Leading cell — rendered first (left on md+) in MonoText; children are the primary content. */
  meta: ReactNode;
}> &
  ClassName;

export const MetaRow = ({ meta, children, className }: Props) => (
  <div className={cn('gap-3xs md:gap-lg flex flex-col md:flex-row md:items-baseline', className)}>
    <MonoText className="shrink-0">{meta}</MonoText>
    <span className="text-fg min-w-0 flex-1 text-[16px] leading-[1.6]">{children}</span>
  </div>
);
