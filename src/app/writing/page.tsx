import type { Metadata } from 'next';

import { alternatesFor } from '@/lib/i18n/metadata';
import { WritingIndexView } from '@/views/WritingIndexView';

export const metadata: Metadata = { title: 'Writing', alternates: alternatesFor('/writing') };

const WritingIndexPage = () => <WritingIndexView lang="en" />;

export default WritingIndexPage;
