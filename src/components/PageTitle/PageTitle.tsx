import type { PropsWithChildren } from 'react';

import { type ClassName, cn } from '@/lib/cn';

export const PageTitle = ({ children, className }: PropsWithChildren & ClassName) => (
  <h1 className={cn('text-page leading-page font-semibold', className)}>{children}</h1>
);
