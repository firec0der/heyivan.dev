import path from 'node:path';

import type { Locale } from '@/lib/i18n/config';

import { loadLocalizedYaml } from './loader';
import { siteSchema } from './schemas';
import type { SiteData } from './types';

const SITE_PATH = path.join(process.cwd(), 'content', 'data', 'site.yaml');

export async function getSiteData(
  locale: Locale = 'en',
  filePath: string = SITE_PATH
): Promise<SiteData> {
  return loadLocalizedYaml(filePath, locale, siteSchema);
}
