import type { Metadata } from 'next';

import { alternatesFor } from '@/lib/i18n/metadata';
import { ProjectsIndexView } from '@/views/ProjectsIndexView';

export const metadata: Metadata = { alternates: alternatesFor('/projects') };

const UkProjectsIndexPage = () => <ProjectsIndexView lang="uk" />;

export default UkProjectsIndexPage;
