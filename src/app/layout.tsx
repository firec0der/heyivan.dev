import './globals.css';

import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/cn';

import { mono, sans, serif } from './fonts';

export const metadata = {
  title: 'heyivan.dev',
  description: 'Personal site of Ivan Stetsenko.'
};

const RootLayout = ({ children }: PropsWithChildren) => (
  <html lang="en" className={cn(sans.variable, serif.variable, mono.variable)}>
    <body>{children}</body>
  </html>
);

export default RootLayout;
