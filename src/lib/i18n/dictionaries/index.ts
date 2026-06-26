import type { Locale } from '@/i18n/routing';

import { en } from './en';
import { uk } from './uk';

export type Dictionary = typeof en;

export const getDictionary = (locale: Locale): Dictionary => (locale === 'uk' ? uk : en);
