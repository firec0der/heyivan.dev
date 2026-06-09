import { type ClassValue, clsx } from 'clsx';
import type { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export type ClassName = { className?: string };

export type HTMLPassThrough<E> = Omit<HTMLAttributes<E>, 'children' | 'className'>;
