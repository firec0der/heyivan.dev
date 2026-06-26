import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

import { BackLink } from '@/components/BackLink';
import { Container } from '@/components/Container';
import { MonoText } from '@/components/MonoText';
import { PageTitle } from '@/components/PageTitle';
import { SectionLabel } from '@/components/SectionLabel';
import { Text } from '@/components/Text';
import { WritingListItem } from '@/components/WritingListItem';
import { getRecentArticles } from '@/lib/content/articles';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { type Locale } from '@/i18n/routing';

export const metadata: Metadata = { title: 'Not found' };

const NotFoundPage = async () => {
  const locale = (await getLocale()) as Locale;
  const t = getDictionary(locale);
  const articles = await getRecentArticles(5);

  return (
    <Container>
      <header className="pt-lg pb-3xl">
        <MonoText className="block">404</MonoText>
        <PageTitle className="mt-3xs">{t.notFound.title}</PageTitle>
        <Text tone="muted" className="mt-3xs">
          {t.notFound.body}
        </Text>
      </header>

      {articles.length > 0 && (
        <section>
          <SectionLabel>{t.home.latestWriting}</SectionLabel>
          <ul className="mt-sm list-none p-0">
            {articles.map((a) => (
              <WritingListItem key={a.slug} slug={a.slug} title={a.title} date={a.date} />
            ))}
          </ul>
        </section>
      )}

      <BackLink href="/">{t.notFound.home}</BackLink>
    </Container>
  );
};

export default NotFoundPage;
