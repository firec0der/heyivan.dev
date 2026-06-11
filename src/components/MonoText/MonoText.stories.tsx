import type { Meta as StoryMeta, StoryObj } from '@storybook/nextjs-vite';

import { MonoText } from './MonoText';

const meta = {
  title: 'MonoText',
  component: MonoText
} satisfies StoryMeta<typeof MonoText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: '2026-06-09 · 5 min read' }
};
