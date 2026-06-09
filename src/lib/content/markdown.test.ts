import { describe, expect,it } from 'vitest';

import { renderMarkdown } from './markdown';

describe('renderMarkdown', () => {
  it('renders basic paragraphs', async () => {
    const html = await renderMarkdown('Hello, world.');
    expect(html).toContain('<p>Hello, world.</p>');
  });

  it('renders headings with id slugs', async () => {
    const html = await renderMarkdown('## Now\n\nbody');
    expect(html).toContain('<h2 id="now">');
  });

  it('applies smart typography', async () => {
    const html = await renderMarkdown(`It's "fine"`);
    expect(html).toMatch(/[‘’]/);
    expect(html).toMatch(/[“”]/);
  });

  it('highlights fenced code blocks', async () => {
    const html = await renderMarkdown('```js\nconst x = 1;\n```');
    expect(html).toContain('data-language="js"');
  });
});
