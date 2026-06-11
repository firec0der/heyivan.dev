import { type ClassName, cn } from '@/lib/cn';
import { formatYearRange } from '@/lib/format';

type Props = {
  start: number;
  end: number;
  degree: string;
  institution: string;
} & ClassName;

export const EducationRow = ({ start, end, degree, institution, className }: Props) => (
  <li
    className={cn(
      'border-border py-sm md:gap-lg gap-3xs flex flex-col border-b last:border-b-0 md:flex-row md:items-baseline',
      className
    )}
  >
    <span className="text-faint shrink-0 font-mono text-[13px] leading-[1.5]">
      {formatYearRange(start, end)}
    </span>
    <span className="text-fg min-w-0 flex-1 text-[16px] leading-[1.6]">
      {degree}, <span className="text-muted">{institution}</span>
    </span>
  </li>
);
