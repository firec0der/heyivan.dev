import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PageTitle } from './PageTitle';

const meta = {
  title: 'PageTitle',
  component: PageTitle
} satisfies Meta<typeof PageTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'The quick brown fox jumps over the lazy dog' }
};

export const Mobile: Story = {
  args: { children: 'The quick brown fox jumps over the lazy dog' },
  globals: { viewport: { value: 'mobile', isRotated: false } }
};
