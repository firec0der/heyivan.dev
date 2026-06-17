import type { Locale } from '../config';
import { en } from './en';
import { uk } from './uk';

export type Dictionary = typeof en;

export const getDictionary = (locale: Locale): Dictionary => (locale === 'uk' ? uk : en);
