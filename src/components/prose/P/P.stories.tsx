import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { P } from './P';

const meta = {
  title: 'Prose/P',
  component: P
} satisfies Meta<typeof P>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children:
      'A paragraph of prose body text in serif at 17px (16px on mobile) / 175% line-height — comfortable for sustained reading inside articles.'
  }
};

export const Mobile: Story = {
  args: {
    children:
      'A paragraph of prose body text in serif at 17px (16px on mobile) / 175% line-height — comfortable for sustained reading inside articles.'
  },
  globals: { viewport: { value: 'mobile', isRotated: false } }
};
