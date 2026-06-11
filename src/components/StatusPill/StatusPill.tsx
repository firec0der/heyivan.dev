import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

type Status = 'live' | 'archived' | 'wip';

const LABEL_TEXT: Record<Status, string> = {
  live: 'Live',
  archived: 'Archived',
  wip: 'WIP'
};

export const StatusPill = ({
  status,
  className,
  ...rest
}: { status: Status } & ComponentProps<'span'>) => (
  <span
    {...rest}
    aria-label={`Status: ${LABEL_TEXT[status]}`}
    className={cn(
      'text-muted text-[10px] leading-[1.3] font-medium tracking-[1px] uppercase',
      'border-border inline-flex items-center rounded-full border px-2 py-0.5',
      className
    )}
  >
    {LABEL_TEXT[status]}
  </span>
);
