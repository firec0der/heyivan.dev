import { ListItem } from '@/components/ListItem';
import { MetaRow } from '@/components/MetaRow';
import { type ClassName, cn } from '@/lib/cn';
import { formatYearRange } from '@/lib/format';

type Props = {
  start: number;
  end: number;
  degree: string;
  institution: string;
} & ClassName;

export const EducationRow = ({ start, end, degree, institution, className }: Props) => (
  <ListItem className={cn('py-sm', className)}>
    <MetaRow meta={formatYearRange(start, end)}>
      {degree}, <span className="text-muted">{institution}</span>
    </MetaRow>
  </ListItem>
);
