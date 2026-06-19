import { Avatar } from '@/components/Avatar';
import { Container } from '@/components/Container';
import { PageTitle } from '@/components/PageTitle';
import { Prose } from '@/components/prose';
import { getAboutContent } from '@/lib/content/about';
import { MdxBody } from '@/lib/content/mdx-body';
import { getSiteData } from '@/lib/content/site';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

export const AboutView = async ({ lang }: { lang: Locale }) => {
  const t = getDictionary(lang);
  const [page, site] = await Promise.all([getAboutContent(lang), getSiteData(lang)]);

  return (
    <Container>
      <header className="pt-lg">
        <PageTitle>{page.title}</PageTitle>
        <div className="mt-lg">
          <Avatar src="/images/avatar.png" alt="" size={120} />
        </div>
      </header>

      <div className="mt-xl">
        {page.fallback && (
          <p className="text-muted border-border mb-lg px-md py-sm rounded-md border text-[14px]">
            {t.content.notTranslated}
          </p>
        )}

        <MdxBody source={page.body} />

        <Prose.H2>{t.about.elsewhere}</Prose.H2>
        <Prose.Ul>
          <Prose.Li>
            <Prose.A href={site.social.github} target="_blank" rel="noopener noreferrer">
              {t.footer.github}
            </Prose.A>
          </Prose.Li>
          <Prose.Li>
            <Prose.A href={site.social.linkedin} target="_blank" rel="noopener noreferrer">
              {t.footer.linkedin}
            </Prose.A>
          </Prose.Li>
          <Prose.Li>
            <Prose.A href={`mailto:${site.social.email}`}>{t.footer.email}</Prose.A>
          </Prose.Li>
        </Prose.Ul>
      </div>
    </Container>
  );
};
