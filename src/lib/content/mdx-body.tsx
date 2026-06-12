import { MDXRemote } from 'next-mdx-remote-client/rsc';

import { mdxComponents } from '@/lib/content/mdx-components';
import { mdxOptions } from '@/lib/content/mdx-options';

type Props = { source: string };

export const MdxBody = ({ source }: Props) => (
  <MDXRemote
    source={source}
    components={mdxComponents}
    options={{ mdxOptions, parseFrontmatter: false }}
  />
);
