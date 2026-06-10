import { type ClassName, cn, type HTMLPassThrough } from '@/lib/cn';

type Props = ClassName & HTMLPassThrough<HTMLHRElement>;

export const Hr = ({ className, ...rest }: Props) => (
  <hr {...rest} className={cn('my-xl border-border border-t', className)} />
);
