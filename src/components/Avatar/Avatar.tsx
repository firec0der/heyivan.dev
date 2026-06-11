import { type ClassName, cn } from '@/lib/cn';

type AvatarSize = 96 | 120;

type Props = {
  src: string;
  alt: string;
  size: AvatarSize;
} & ClassName;

export const Avatar = ({ src, alt, size, className }: Props) => (
  <img
    src={src}
    alt={alt}
    width={size}
    height={size}
    style={{ width: size, height: size }}
    className={cn('rounded-full object-cover', className)}
  />
);
