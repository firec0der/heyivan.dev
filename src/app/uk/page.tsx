import type { Metadata } from 'next';

import { alternatesFor } from '@/lib/i18n/metadata';
import { HomeView } from '@/views/HomeView';

export const metadata: Metadata = { alternates: alternatesFor('/') };

const UkHomePage = () => <HomeView lang="uk" />;

export default UkHomePage;
