import type { MDXComponents } from 'mdx/types';
import { type ComponentProps,createElement } from 'react';

import { Prose } from '@/components/prose';

const SectionSwitch = ({ className, ...rest }: ComponentProps<'section'>) =>
  className?.includes('footnotes')
    ? createElement(Prose.FootnoteSection, { className, ...rest })
    : createElement('section', { className, ...rest });

const SupSwitch = (props: ComponentProps<'sup'>) =>
  'data-footnote-ref' in props
    ? createElement(Prose.FootnoteRef, props)
    : createElement('sup', props);

export const mdxComponents: MDXComponents = {
  p: Prose.P,
  h2: Prose.H2,
  h3: Prose.H3,
  h4: Prose.H4,
  a: Prose.A,
  strong: Prose.Strong,
  em: Prose.Em,
  del: Prose.Del,
  kbd: Prose.Kbd,
  code: Prose.Code,
  ul: Prose.Ul,
  ol: Prose.Ol,
  li: Prose.Li,
  blockquote: Prose.Blockquote,
  hr: Prose.Hr,
  img: Prose.Img,
  figure: Prose.Figure,
  figcaption: Prose.Figcaption,
  pre: Prose.Pre,
  table: Prose.Table,
  thead: Prose.Thead,
  tr: Prose.Tr,
  th: Prose.Th,
  td: Prose.Td,
  sup: SupSwitch,
  section: SectionSwitch
};
