import { type ClassName, cn } from '@/lib/cn';

export const SkipLink = ({ className }: ClassName) => (
  <a
    href="#main"
    className={cn(
      'bg-canvas text-accent border-border px-xs py-2xs rounded-sm border text-[14px] underline',
      'top-2xs left-2xs absolute z-50',
      '-translate-y-[200%] transition-transform focus-visible:translate-y-0',
      className
    )}
  >
    Skip to content
  </a>
);
