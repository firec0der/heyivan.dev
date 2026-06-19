import Link from 'next/link';

import { ListItem } from '@/components/ListItem';
import { MetaRow } from '@/components/MetaRow';
import type { ClassName } from '@/lib/cn';
import { formatArticleDate } from '@/lib/format';

type Props = {
  slug: string;
  title: string;
  date: string;
  href?: string;
} & ClassName;

export const WritingListItem = ({ slug, title, date, href, className }: Props) => (
  <ListItem className={className}>
    <Link
      href={href ?? `/writing/${slug}`}
      className="py-sm hover:bg-surface block transition-colors"
    >
      <article>
        <MetaRow meta={<time dateTime={date}>{formatArticleDate(date)}</time>}>{title}</MetaRow>
      </article>
    </Link>
  </ListItem>
);
