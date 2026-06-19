import type { Metadata } from 'next';

import { WritingIndexView } from '@/views/WritingIndexView';

export const metadata: Metadata = { title: 'Writing' };

const WritingIndexPage = () => <WritingIndexView lang="en" />;

export default WritingIndexPage;
