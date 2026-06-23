import type { Metadata } from 'next';

import { alternatesFor } from '@/lib/i18n/metadata';
import { WritingIndexView } from '@/views/WritingIndexView';

export const metadata: Metadata = { alternates: alternatesFor('/writing') };

const UkWritingIndexPage = () => <WritingIndexView lang="uk" />;

export default UkWritingIndexPage;
