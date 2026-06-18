import { Container } from '@/components/Container';
import { PageTitle } from '@/components/PageTitle';
import { SectionLabel } from '@/components/SectionLabel';
import { Subtitle } from '@/components/Subtitle';
import { WritingListItem } from '@/components/WritingListItem';
import { getAllArticles } from '@/lib/content/articles';
import { groupByYear } from '@/lib/format';
import { type Locale, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

export const WritingIndexView = async ({ lang }: { lang: Locale }) => {
  const t = getDictionary(lang);
  const articles = await getAllArticles(lang);
  const byYear = groupByYear(articles);
  const years = [...byYear.keys()].sort((a, b) => (a < b ? 1 : -1));

  return (
    <Container>
      <header className="pt-lg pb-3xl">
        <PageTitle>{t.writing.title}</PageTitle>
        <Subtitle className="mt-3xs">{t.writing.subtitle}</Subtitle>
      </header>

      {years.map((year) => (
        <section key={year} className="mt-2xl first:mt-0">
          <SectionLabel>{year}</SectionLabel>
          <ul className="mt-sm list-none p-0">
            {byYear.get(year)!.map((a) => (
              <WritingListItem
                key={a.slug}
                slug={a.slug}
                title={a.title}
                date={a.date}
                href={localizePath(`/writing/${a.slug}`, lang)}
              />
            ))}
          </ul>
        </section>
      ))}
    </Container>
  );
};
