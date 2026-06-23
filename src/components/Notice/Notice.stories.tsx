import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Notice } from './Notice';

const meta = {
  title: 'Notice',
  component: Notice
} satisfies Meta<typeof Notice>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'This page has not been translated yet.' }
};

export const Custom: Story = {
  args: { children: 'Custom informational message.', className: 'mb-lg' }
};
