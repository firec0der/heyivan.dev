import { notFound } from 'next/navigation';

import { BackLink } from '@/components/BackLink';
import { Container } from '@/components/Container';
import { DetailTitle } from '@/components/DetailTitle';
import { LinkArrow } from '@/components/LinkArrow';
import { MonoText } from '@/components/MonoText';
import { Notice } from '@/components/Notice';
import { SectionLabel } from '@/components/SectionLabel';
import { StatusPill } from '@/components/StatusPill';
import { MdxBody } from '@/lib/content/mdx-body';
import { getProjectBySlug } from '@/lib/content/projects';
import { formatArticleDate } from '@/lib/format';
import { type Locale, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

export const ProjectView = async ({ lang, slug }: { lang: Locale; slug: string }) => {
  const t = getDictionary(lang);
  const project = await getProjectBySlug(slug, lang);
  if (!project) notFound();

  return (
    <Container width="article" lang={lang}>
      <BackLink href={localizePath('/projects', lang)}>{t.projects.allProjects}</BackLink>

      <header className="pb-xl">
        <DetailTitle>{project.title}</DetailTitle>
        <p className="text-muted mt-xs text-[18px] leading-[1.6]">{project.tagline}</p>
        <div className="gap-xs mt-sm flex items-center">
          <StatusPill status={project.status} />
          <MonoText>
            <time dateTime={project.date}>{formatArticleDate(project.date)}</time>
          </MonoText>
        </div>
      </header>

      {project.fallback && <Notice className="mb-lg">{t.content.notTranslated}</Notice>}

      {project.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.coverImage} alt="" className="mb-2xl w-full rounded-md" />
      )}

      <MdxBody source={project.body} />

      {project.stack.length > 0 && (
        <section className="mt-3xl">
          <SectionLabel>{t.projects.stack}</SectionLabel>
          <p className="text-muted mt-sm font-mono text-[14px] leading-[1.6]">
            {project.stack.join(' · ')}
          </p>
        </section>
      )}

      {Object.keys(project.links).length > 0 && (
        <section className="mt-3xl">
          <SectionLabel>{t.projects.links}</SectionLabel>
          <ul className="gap-2xs mt-sm flex list-none flex-col p-0">
            {project.links.live && (
              <li>
                <LinkArrow href={project.links.live} external>
                  {t.projects.live}
                </LinkArrow>
              </li>
            )}
            {project.links.appstore && (
              <li>
                <LinkArrow href={project.links.appstore} external>
                  {t.projects.appstore}
                </LinkArrow>
              </li>
            )}
            {project.links.playstore && (
              <li>
                <LinkArrow href={project.links.playstore} external>
                  {t.projects.playstore}
                </LinkArrow>
              </li>
            )}
            {project.links.source && (
              <li>
                <LinkArrow href={project.links.source} external>
                  {t.projects.source}
                </LinkArrow>
              </li>
            )}
          </ul>
        </section>
      )}
    </Container>
  );
};
