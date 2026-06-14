import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Chevron } from './Chevron';

const meta = {
  title: 'Chevron',
  component: Chevron,
  args: { className: 'text-fg' }
} satisfies Meta<typeof Chevron>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Closed: Story = { args: { open: false } };

export const Open: Story = { args: { open: true } };
