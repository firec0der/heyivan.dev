import type { Metadata } from 'next';

import { alternatesFor } from '@/lib/i18n/metadata';
import { AboutView } from '@/views/AboutView';

export const metadata: Metadata = { title: 'About', alternates: alternatesFor('/about') };

const AboutPage = () => <AboutView lang="en" />;

export default AboutPage;
