'use client';

import { usePathname } from 'next/navigation';

import { type Locale, localeFromPath } from './config';

export const useLocale = (): Locale => localeFromPath(usePathname() ?? '/');
