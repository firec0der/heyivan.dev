import type { PropsWithChildren } from 'react';

import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = PropsWithChildren & ClassName & HTMLPassThrough<HTMLPreElement>;

export const Pre = ({ children, className, ...rest }: Props) => (
  <pre
    {...rest}
    className={cn(
      'bg-surface mb-lg p-lg overflow-x-auto rounded-md font-mono text-[14px] leading-[1.65]',
      '[&_code]:bg-transparent [&_code]:p-0',
      className
    )}
  >
    {children}
  </pre>
);
