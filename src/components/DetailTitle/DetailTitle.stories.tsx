import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DetailTitle } from './DetailTitle';

const meta = {
  title: 'DetailTitle',
  component: DetailTitle
} satisfies Meta<typeof DetailTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'The event loop, observed from the inside' }
};
