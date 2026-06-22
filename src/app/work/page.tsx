import type { Metadata } from 'next';

import { alternatesFor } from '@/lib/i18n/metadata';
import { WorkView } from '@/views/WorkView';

export const metadata: Metadata = { title: 'Work', alternates: alternatesFor('/work') };

const WorkPage = () => <WorkView lang="en" />;

export default WorkPage;
