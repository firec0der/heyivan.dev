import { Label } from './typography';

type Status = 'live' | 'archived' | 'wip';

const LABEL_TEXT: Record<Status, string> = {
  live: 'Live',
  archived: 'Archived',
  wip: 'WIP'
};

export const StatusPill = ({ status }: { status: Status }) => (
  <Label
    aria-label={`Status: ${LABEL_TEXT[status]}`}
    className="inline-flex items-center rounded-full border border-[color:var(--color-border)] px-2 py-0.5"
  >
    {LABEL_TEXT[status]}
  </Label>
);
