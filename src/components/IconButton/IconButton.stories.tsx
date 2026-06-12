import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { IconButton } from './IconButton';

const meta = {
  title: 'IconButton',
  component: IconButton
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Burger: Story = {
  args: { 'aria-label': 'Open menu', children: '☰' }
};

export const Close: Story = {
  args: { 'aria-label': 'Close menu', children: '×' }
};

export const Themed: Story = {
  args: {
    'aria-label': 'Switch theme',
    className: 'hover:text-fg rounded-full transition-colors',
    children: '☽'
  }
};
