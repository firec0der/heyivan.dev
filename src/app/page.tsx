import { Avatar } from '@/components/Avatar';
import { Container } from '@/components/Container';
import { LinkArrow } from '@/components/LinkArrow';
import { PageTitle } from '@/components/PageTitle';
import { SectionLabel } from '@/components/SectionLabel';
import { Subtitle } from '@/components/Subtitle';
import { WritingListItem } from '@/components/WritingListItem';
import { getAllArticles } from '@/lib/content/articles';
import { getSiteData } from '@/lib/content/site';

const HomePage = async () => {
  const [site, articles] = await Promise.all([getSiteData(), getAllArticles()]);
  const latest = articles.slice(0, 5);

  return (
    <Container>
      <section className="gap-sm pt-lg pb-3xl flex flex-col items-start">
        <Avatar src="/images/avatar.png" alt="" size={96} />
        <div>
          <PageTitle>{site.hero_greeting}</PageTitle>
          <Subtitle className="mt-3xs">{site.role}</Subtitle>
        </div>
      </section>

      <SectionLabel>Latest writing</SectionLabel>
      <ul className="mt-sm list-none p-0">
        {latest.map((a) => (
          <WritingListItem key={a.slug} slug={a.slug} title={a.title} date={a.date} />
        ))}
      </ul>

      <div className="pt-lg">
        <LinkArrow href="/writing">All writing</LinkArrow>
      </div>
    </Container>
  );
};

export default HomePage;
