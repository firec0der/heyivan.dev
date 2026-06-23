import type { Metadata } from 'next';

import { alternatesFor } from '@/lib/i18n/metadata';
import { AboutView } from '@/views/AboutView';

export const metadata: Metadata = { alternates: alternatesFor('/about') };

const UkAboutPage = () => <AboutView lang="uk" />;

export default UkAboutPage;
