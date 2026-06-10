import type { MDXComponents } from 'mdx/types';
import { evaluate } from 'next-mdx-remote-client/rsc';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { mdxOptions } from './mdx-options';

async function renderMdx(source: string, components?: MDXComponents): Promise<string> {
  const { content, error } = await evaluate({
    source,
    options: { mdxOptions, parseFrontmatter: false },
    components
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

  it('renders custom React components passed via the components map', async () => {
    const Hello = ({ name }: { name: string }) =>
      createElement('span', { 'data-testid': 'hello' }, `Hello, ${name}!`);

    const html = await renderMdx('Greeting: <Hello name="world" />', { Hello });

    expect(html).toBe('<p>Greeting: <span data-testid="hello">Hello, world!</span></p>');
  });
});
