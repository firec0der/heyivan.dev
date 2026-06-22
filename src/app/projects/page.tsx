import type { Metadata } from 'next';

import { alternatesFor } from '@/lib/i18n/metadata';
import { ProjectsIndexView } from '@/views/ProjectsIndexView';

export const metadata: Metadata = { title: 'Projects', alternates: alternatesFor('/projects') };

const ProjectsIndexPage = () => <ProjectsIndexView lang="en" />;

export default ProjectsIndexPage;
