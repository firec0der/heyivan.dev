import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/cn';

type Tone = 'default' | 'muted';

const TONE_CLASS: Record<Tone, string | undefined> = {
  default: undefined,
  muted: 'text-[color:var(--color-text-muted)]'
};

export function Body({
  children,
  className,
  tone = 'default'
}: PropsWithChildren<{ className?: string; tone?: Tone }>) {
  return (
    <p className={cn('text-[16px] leading-[160%]', TONE_CLASS[tone], className)}>{children}</p>
  );
}
