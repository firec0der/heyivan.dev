import type { Metadata } from 'next';

import { ProjectsIndexView } from '@/views/ProjectsIndexView';

export const metadata: Metadata = { title: 'Projects' };

const ProjectsIndexPage = () => <ProjectsIndexView lang="en" />;

export default ProjectsIndexPage;
