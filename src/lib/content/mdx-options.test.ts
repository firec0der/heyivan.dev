import { evaluate } from 'next-mdx-remote-client/rsc';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { mdxOptions } from './mdx-options';

async function renderMdx(source: string): Promise<string> {
  const { content, error } = await evaluate({
    source,
    options: { mdxOptions, parseFrontmatter: false }
  });
  if (error) throw error;
  return renderToStaticMarkup(content);
}

describe('mdxOptions', () => {
  it('compiles a paragraph', async () => {
    const html = await renderMdx('Hello, world.');
    expect(html).toContain('<p>');
    expect(html).toContain('Hello, world.');
  });

  it('applies remark-smartypants to ASCII quotes', async () => {
    const html = await renderMdx(`It's "fine"`);
    expect(html).toMatch(/[‘’]/);
    expect(html).toMatch(/[“”]/);
  });

  it('applies rehype-slug heading ids', async () => {
    const html = await renderMdx('## Now\n\nbody');
    expect(html).toContain('id="now"');
  });

  it('applies rehype-pretty-code to fenced code blocks', async () => {
    const html = await renderMdx('```js\nconst x = 1;\n```');
    expect(html).toContain('data-language="js"');
  });
});
