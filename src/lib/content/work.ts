import path from 'node:path';

import { loadYamlFile } from './loader';
import { workSchema } from './schemas';
import type { WorkData } from './types';

const WORK_PATH = path.join(process.cwd(), 'content', 'data', 'work.yaml');

export async function getWorkData(filePath: string = WORK_PATH): Promise<WorkData> {
  return loadYamlFile(filePath, workSchema);
}
