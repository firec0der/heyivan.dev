import type { Meta as StoryMeta, StoryObj } from '@storybook/nextjs-vite';

import { Meta } from './Meta';

const meta = {
  title: 'Atoms/Typography/Meta',
  component: Meta
} satisfies StoryMeta<typeof Meta>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: '2026-06-09 · 5 min read' }
};
