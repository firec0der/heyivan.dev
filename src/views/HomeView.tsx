import { Avatar } from '@/components/Avatar';
import { Container } from '@/components/Container';
import { LinkArrow } from '@/components/LinkArrow';
import { PageTitle } from '@/components/PageTitle';
import { SectionLabel } from '@/components/SectionLabel';
import { Subtitle } from '@/components/Subtitle';
import { WritingListItem } from '@/components/WritingListItem';
import { getRecentArticles } from '@/lib/content/articles';
import { getSiteData } from '@/lib/content/site';
import { type Locale, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

export const HomeView = async ({ lang }: { lang: Locale }) => {
  const t = getDictionary(lang);
  const [site, latest] = await Promise.all([getSiteData(lang), getRecentArticles(5, lang)]);

  return (
    <Container>
      <section className="gap-sm pt-lg pb-3xl flex flex-col items-start">
        <Avatar src="/images/avatar.png" alt="" size={96} />
        <div>
          <PageTitle>{site.greeting}</PageTitle>
          <Subtitle className="mt-3xs">{site.role}</Subtitle>
        </div>
      </section>

      <SectionLabel>{t.home.latestWriting}</SectionLabel>
      <ul className="mt-sm list-none p-0">
        {latest.map((a) => (
          <WritingListItem
            key={a.slug}
            slug={a.slug}
            title={a.title}
            date={a.date}
            href={localizePath(`/writing/${a.slug}`, lang)}
          />
        ))}
      </ul>

      <div className="pt-lg">
        <LinkArrow href={localizePath('/writing', lang)}>{t.home.allWriting}</LinkArrow>
      </div>
    </Container>
  );
};
