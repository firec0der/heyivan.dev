import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MobileMenuOverlay } from './MobileMenuOverlay';

const meta = {
  title: 'MobileMenuOverlay',
  component: MobileMenuOverlay,
  parameters: { layout: 'fullscreen' },
  args: { wordmark: 'ivan.', onClose: () => {} }
} satisfies Meta<typeof MobileMenuOverlay>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Closed: Story = { args: { open: false } };
export const Open: Story = { args: { open: true } };
