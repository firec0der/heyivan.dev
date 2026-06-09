import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export async function setupFixtureDir(files: Record<string, string>): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'heyivan-test-'));
  for (const [name, content] of Object.entries(files)) {
    await fs.writeFile(path.join(dir, name), content);
  }
  return dir;
}

export async function cleanupFixtureDir(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true });
}
