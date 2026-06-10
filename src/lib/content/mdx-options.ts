import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import type { PluggableList } from 'unified';

export const mdxOptions: { remarkPlugins: PluggableList; rehypePlugins: PluggableList } = {
  remarkPlugins: [remarkGfm, remarkSmartypants],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: ['heading-anchor'] } }],
    [rehypePrettyCode, { theme: { light: 'github-light', dark: 'github-dark' }, keepBackground: false }]
  ]
};
