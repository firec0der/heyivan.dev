import type { Metadata } from 'next';

import { WorkView } from '@/views/WorkView';

export const metadata: Metadata = { title: 'Work' };

const WorkPage = () => <WorkView lang="en" />;

export default WorkPage;
