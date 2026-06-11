import type { Metadata } from 'next';

import { Container } from '@/components/Container';
import { PageTitle } from '@/components/PageTitle';
import { ProjectCard } from '@/components/ProjectCard';
import { Subtitle } from '@/components/Subtitle';
import { getAllProjects } from '@/lib/content/projects';

export const metadata: Metadata = { title: 'Projects' };

const ProjectsIndexPage = async () => {
  const projects = await getAllProjects();

  return (
    <Container>
      <header className="pt-lg pb-3xl">
        <PageTitle>Projects</PageTitle>
        <Subtitle className="mt-3xs">Side projects and the occasional product.</Subtitle>
      </header>

      <ul className="list-none p-0">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ul>
    </Container>
  );
};

export default ProjectsIndexPage;
