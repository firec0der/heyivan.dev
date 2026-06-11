import Link from 'next/link';

import { type ClassName, cn } from '@/lib/cn';
import { formatArticleDate } from '@/lib/format';

type Props = {
  slug: string;
  title: string;
  date: string;
} & ClassName;

export const WritingListItem = ({ slug, title, date, className }: Props) => (
  <li className={cn('border-border border-b last:border-b-0', className)}>
    <Link href={`/writing/${slug}`} className="py-sm hover:bg-surface block transition-colors">
      <article>
        <div className="gap-3xs md:gap-lg flex flex-col md:flex-row md:items-baseline">
          <time dateTime={date} className="text-faint shrink-0 font-mono text-[13px] leading-[1.5]">
            {formatArticleDate(date)}
          </time>
          <span className="text-fg min-w-0 flex-1 text-[16px] leading-[1.6]">{title}</span>
        </div>
      </article>
    </Link>
  </li>
);
