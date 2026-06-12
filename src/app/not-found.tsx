import type { Metadata } from 'next';

import { BackLink } from '@/components/BackLink';
import { Container } from '@/components/Container';
import { MonoText } from '@/components/MonoText';
import { PageTitle } from '@/components/PageTitle';
import { SectionLabel } from '@/components/SectionLabel';
import { Text } from '@/components/Text';
import { WritingListItem } from '@/components/WritingListItem';
import { getRecentArticles } from '@/lib/content/articles';

export const metadata: Metadata = { title: 'Not found' };

const NotFoundPage = async () => {
  const articles = await getRecentArticles(5);

  return (
    <Container>
      <header className="pt-lg pb-3xl">
        <MonoText className="block">404</MonoText>
        <PageTitle className="mt-3xs">Not found.</PageTitle>
        <Text tone="muted" className="mt-3xs">
          That URL doesn&apos;t lead anywhere on this site.
        </Text>
      </header>

      {articles.length > 0 && (
        <section>
          <SectionLabel>Recent writing</SectionLabel>
          <ul className="mt-sm list-none p-0">
            {articles.map((a) => (
              <WritingListItem key={a.slug} slug={a.slug} title={a.title} date={a.date} />
            ))}
          </ul>
        </section>
      )}

      <BackLink href="/">Back home</BackLink>
    </Container>
  );
};

export default NotFoundPage;
