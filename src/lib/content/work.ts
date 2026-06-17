import path from 'node:path';

import type { Locale } from '@/lib/i18n/config';

import { loadLocalizedYaml } from './loader';
import { workSchema } from './schemas';
import type { WorkData } from './types';

const WORK_PATH = path.join(process.cwd(), 'content', 'data', 'work.yaml');

export async function getWorkData(
  locale: Locale = 'en',
  filePath: string = WORK_PATH
): Promise<WorkData> {
  return loadLocalizedYaml(filePath, locale, workSchema);
}
