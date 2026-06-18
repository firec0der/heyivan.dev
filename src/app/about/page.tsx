import type { Metadata } from 'next';

import { AboutView } from '@/views/AboutView';

export const metadata: Metadata = { title: 'About' };

const AboutPage = () => <AboutView lang="en" />;

export default AboutPage;
