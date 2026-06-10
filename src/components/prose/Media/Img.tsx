import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';

type Props = ComponentPropsWithoutRef<'img'>;

export const Img = ({ className, alt = '', loading = 'lazy', ...rest }: Props) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img {...rest} alt={alt} loading={loading} className={cn('mb-lg w-full rounded-md', className)} />
);
