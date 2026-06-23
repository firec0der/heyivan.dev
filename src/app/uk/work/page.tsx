import type { Metadata } from 'next';

import { alternatesFor } from '@/lib/i18n/metadata';
import { WorkView } from '@/views/WorkView';

export const metadata: Metadata = { alternates: alternatesFor('/work') };

const UkWorkPage = () => <WorkView lang="uk" />;

export default UkWorkPage;
