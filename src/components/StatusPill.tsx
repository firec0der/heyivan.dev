type Status = 'live' | 'archived' | 'wip';

const LABEL: Record<Status, string> = {
  live: 'Live',
  archived: 'Archived',
  wip: 'WIP'
};

export const StatusPill = ({ status }: { status: Status }) => (
  <span
    aria-label={`Status: ${LABEL[status]}`}
    className="inline-flex items-center rounded-full border border-[color:var(--color-border)] px-2 py-0.5 text-[10px] font-medium tracking-[1px] text-[color:var(--color-text-muted)] uppercase"
  >
    {LABEL[status]}
  </span>
);
