import type { PropsWithChildren } from 'react';

import { type ClassName, cn } from '@/lib/cn';

type Width = 'content' | 'article';

type Props = PropsWithChildren<{ width?: Width }> & ClassName;

const WIDTH_CLASSES: Record<Width, string> = {
  content: 'max-w-content',
  article: 'max-w-article'
};

export const Container = ({ children, width = 'content', className }: Props) => (
  <div className={cn('px-lg mx-auto w-full md:px-0', WIDTH_CLASSES[width], className)}>
    {children}
  </div>
);
