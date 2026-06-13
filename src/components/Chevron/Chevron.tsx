import { type ClassName, cn } from '@/lib/cn';

type Props = { open?: boolean } & ClassName;

export const Chevron = ({ open = false, className }: Props) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn(
      'size-[22px] shrink-0 transition-transform duration-[var(--motion-duration-base)] ease-[var(--motion-easing-standard)]',
      open && 'rotate-180',
      className
    )}
  >
    <path d="M8.5 10h7l-3.5 6z" />
  </svg>
);
