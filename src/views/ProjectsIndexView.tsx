import { Container } from '@/components/Container';
import { PageTitle } from '@/components/PageTitle';
import { ProjectCard } from '@/components/ProjectCard';
import { Subtitle } from '@/components/Subtitle';
import { getAllProjects } from '@/lib/content/projects';
import { type Locale, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

export const ProjectsIndexView = async ({ lang }: { lang: Locale }) => {
  const t = getDictionary(lang);
  const projects = await getAllProjects(lang);

  return (
    <Container>
      <header className="pt-lg pb-3xl">
        <PageTitle>{t.projects.title}</PageTitle>
        <Subtitle className="mt-3xs">{t.projects.subtitle}</Subtitle>
      </header>

      <ul className="list-none p-0">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            href={localizePath(`/projects/${project.slug}`, lang)}
          />
        ))}
      </ul>
    </Container>
  );
};
