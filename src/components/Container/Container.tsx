import type { PropsWithChildren } from 'react';

import { type ClassName, cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n/config';

type Width = 'content' | 'article';

type Props = PropsWithChildren<{ width?: Width; lang?: Locale }> & ClassName;

const WIDTH_CLASSES: Record<Width, string> = {
  content: 'max-w-content',
  article: 'max-w-article'
};

export const Container = ({ children, width = 'content', lang, className }: Props) => (
  <div lang={lang} className={cn('px-lg mx-auto w-full md:px-0', WIDTH_CLASSES[width], className)}>
    {children}
  </div>
);
