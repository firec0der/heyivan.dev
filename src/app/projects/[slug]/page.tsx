import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote-client/rsc';

import { Container } from '@/components/Container';
import { LinkArrow } from '@/components/LinkArrow';
import { SectionLabel } from '@/components/SectionLabel';
import { StatusPill } from '@/components/StatusPill';
import { mdxComponents } from '@/lib/content/mdx-components';
import { mdxOptions } from '@/lib/content/mdx-options';
import { getProjectBySlug, getProjectSlugs } from '@/lib/content/projects';

type Params = { slug: string };
type Props = { params: Promise<Params> };

export const dynamicParams = false;

export const generateStaticParams = async (): Promise<Params[]> => {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    openGraph: { title: project.title, description: project.tagline }
  };
};

const ProjectDetailPage = async ({ params }: Props) => {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <Container width="article">
      <div className="pt-lg pb-lg">
        <LinkArrow href="/projects" direction="back">
          All projects
        </LinkArrow>
      </div>

      <header className="pb-xl">
        <h1 className="text-fg font-serif text-[34px] leading-[1.25] font-semibold">
          {project.title}
        </h1>
        <p className="text-muted mt-xs text-[18px] leading-[1.6]">{project.tagline}</p>
        <div className="gap-xs mt-sm flex items-center">
          <StatusPill status={project.status} />
          <span className="text-faint font-mono text-[13px] leading-[1.5]">
            <time dateTime={project.date}>{project.date}</time>
          </span>
        </div>
      </header>

      {project.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.coverImage} alt="" className="mb-2xl w-full rounded-md" />
      )}

      <MDXRemote
        source={project.body}
        components={mdxComponents}
        options={{ mdxOptions, parseFrontmatter: false }}
      />

      {project.stack.length > 0 && (
        <section className="mt-3xl">
          <SectionLabel>Stack</SectionLabel>
          <p className="text-muted mt-sm font-mono text-[14px] leading-[1.6]">
            {project.stack.join(' · ')}
          </p>
        </section>
      )}

      {Object.keys(project.links).length > 0 && (
        <section className="mt-3xl">
          <SectionLabel>Links</SectionLabel>
          <ul className="gap-2xs mt-sm flex list-none flex-col p-0">
            {project.links.live && (
              <li>
                <LinkArrow href={project.links.live} external>
                  Live
                </LinkArrow>
              </li>
            )}
            {project.links.appstore && (
              <li>
                <LinkArrow href={project.links.appstore} external>
                  App Store
                </LinkArrow>
              </li>
            )}
            {project.links.playstore && (
              <li>
                <LinkArrow href={project.links.playstore} external>
                  Play Store
                </LinkArrow>
              </li>
            )}
            {project.links.source && (
              <li>
                <LinkArrow href={project.links.source} external>
                  Source
                </LinkArrow>
              </li>
            )}
          </ul>
        </section>
      )}
    </Container>
  );
};

export default ProjectDetailPage;
