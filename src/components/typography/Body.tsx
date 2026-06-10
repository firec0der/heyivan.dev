import type { PropsWithChildren } from 'react';

import { type ClassName, cn } from '@/lib/cn';

type Tone = 'default' | 'muted';

const TONE_CLASS: Record<Tone, string | undefined> = {
  default: undefined,
  muted: 'text-muted'
};

export const Body = ({
  children,
  className,
  tone = 'default'
}: PropsWithChildren<{ tone?: Tone }> & ClassName) => (
  <p className={cn('text-body leading-body', TONE_CLASS[tone], className)}>{children}</p>
);
