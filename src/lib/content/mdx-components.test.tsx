import { evaluate } from 'next-mdx-remote-client/rsc';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { mdxComponents } from './mdx-components';
import { mdxOptions } from './mdx-options';

const renderMdx = async (source: string): Promise<string> => {
  const { content, error } = await evaluate({
    source,
    options: { mdxOptions, parseFrontmatter: false },
    components: mdxComponents
  });
  if (error) throw error;
  return renderToStaticMarkup(content);
};

describe('mdxComponents — block elements', () => {
  it('p → Prose.P with text-prose', async () => {
    const html = await renderMdx('Hello world.');
    expect(html).toMatch(/<p[^>]*class="[^"]*text-\[17px\][^"]*"[^>]*>Hello world\.<\/p>/);
  });

  it('h2 → Prose.H2 with text-prose-h2', async () => {
    const html = await renderMdx('## A heading');
    expect(html).toMatch(/<h2[^>]*class="[^"]*text-\[22px\][^"]*"/);
  });

  it('h3 → Prose.H3 with text-prose-h3', async () => {
    const html = await renderMdx('### A subheading');
    expect(html).toMatch(/<h3[^>]*class="[^"]*text-\[18px\][^"]*"/);
  });

  it('h4 → Prose.H4 with text-prose-h4', async () => {
    const html = await renderMdx('#### A smaller heading');
    expect(html).toMatch(/<h4[^>]*class="[^"]*text-\[16px\][^"]*"/);
  });

  it('blockquote → Prose.Blockquote with left border', async () => {
    const html = await renderMdx('> Quote');
    expect(html).toMatch(/<blockquote[^>]*class="[^"]*border-l-2[^"]*"/);
  });

  it('hr → Prose.Hr with top border', async () => {
    const html = await renderMdx('Before.\n\n---\n\nAfter.');
    expect(html).toMatch(/<hr[^>]*class="[^"]*border-t[^"]*"/);
  });

  it('ul → Prose.Ul with list-disc; li → Prose.Li', async () => {
    const html = await renderMdx('- First\n- Second');
    expect(html).toMatch(/<ul[^>]*class="[^"]*list-disc[^"]*"/);
    expect(html).toMatch(/<li[^>]*class="[^"]*text-\[17px\][^"]*"/);
  });

  it('ol → Prose.Ol with list-decimal', async () => {
    const html = await renderMdx('1. First\n2. Second');
    expect(html).toMatch(/<ol[^>]*class="[^"]*list-decimal[^"]*"/);
  });

  it('pre → Prose.Pre with surface bg', async () => {
    const html = await renderMdx('```\ncode\n```');
    expect(html).toMatch(/<pre[^>]*class="[^"]*bg-surface[^"]*"/);
  });

  it('img → Prose.Img with w-full', async () => {
    const html = await renderMdx('![alt](https://example.com/a.png)');
    expect(html).toMatch(/<img[^>]*class="[^"]*w-full[^"]*"/);
  });

  it('table / thead / tr / th / td → Prose.Table family (via GFM)', async () => {
    const html = await renderMdx('| A | B |\n|---|---|\n| 1 | 2 |');
    expect(html).toMatch(/<table[^>]*class="[^"]*border-collapse[^"]*"/);
    expect(html).toMatch(/<thead[^>]*class="[^"]*border-b[^"]*"/);
    expect(html).toMatch(/<tr[^>]*class="[^"]*border-b[^"]*"/);
    expect(html).toMatch(/<th[^>]*class="[^"]*font-semibold[^"]*"/);
    expect(html).toMatch(/<td[^>]*class="[^"]*text-prose[^"]*"/);
  });
});

describe('mdxComponents — inline elements', () => {
  it('a → Prose.A with text-accent', async () => {
    const html = await renderMdx('A [link](#x) inside.');
    expect(html).toMatch(/<a[^>]*class="[^"]*text-accent[^"]*"/);
    expect(html).toContain('href="#x"');
  });

  it('strong → Prose.Strong with font-semibold', async () => {
    const html = await renderMdx('A **bold** word.');
    expect(html).toMatch(/<strong[^>]*class="[^"]*font-semibold[^"]*"[^>]*>bold<\/strong>/);
  });

  it('em → Prose.Em with italic', async () => {
    const html = await renderMdx('An *italic* word.');
    expect(html).toMatch(/<em[^>]*class="[^"]*italic[^"]*"[^>]*>italic<\/em>/);
  });

  it('del (GFM ~~) → Prose.Del with line-through', async () => {
    const html = await renderMdx('A ~~struck~~ word.');
    expect(html).toMatch(/<del[^>]*class="[^"]*line-through[^"]*"[^>]*>struck<\/del>/);
  });

  it('inline code → Prose.Code with font-mono', async () => {
    const html = await renderMdx('A `code` span.');
    expect(html).toMatch(/<code[^>]*class="[^"]*font-mono[^"]*"[^>]*>code<\/code>/);
  });
});

describe('mdxComponents — smart wrappers', () => {
  it('non-footnote sup falls through to default <sup>', async () => {
    const html = await renderMdx('H<sup>2</sup>O');
    expect(html).toMatch(/H<sup>2<\/sup>O/);
    expect(html).not.toMatch(/<sup[^>]*class="[^"]*text-accent/);
  });

  it('non-footnote section falls through to default <section>', async () => {
    const html = await renderMdx('<section><p>Plain.</p></section>');
    expect(html).toMatch(/<section>/);
    expect(html).not.toMatch(/<section[^>]*class="[^"]*border-t/);
  });
});

describe('mdxComponents — coverage check', () => {
  it('registry maps every supported element to a component', () => {
    const expected = [
      'p',
      'h2',
      'h3',
      'h4',
      'a',
      'strong',
      'em',
      'del',
      'kbd',
      'code',
      'ul',
      'ol',
      'li',
      'blockquote',
      'hr',
      'img',
      'figure',
      'figcaption',
      'pre',
      'table',
      'thead',
      'tr',
      'th',
      'td',
      'sup',
      'section'
    ];
    for (const key of expected) {
      expect(mdxComponents).toHaveProperty(key);
    }
  });
});
