import path from 'node:path';

import { loadYamlFile } from './loader';
import { siteSchema } from './schemas';
import type { SiteData } from './types';

const SITE_PATH = path.join(process.cwd(), 'content', 'data', 'site.yaml');

export async function getSiteData(filePath: string = SITE_PATH): Promise<SiteData> {
  return loadYamlFile(filePath, siteSchema);
}
