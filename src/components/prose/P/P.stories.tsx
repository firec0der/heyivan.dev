import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { P } from './P';

const meta = {
  title: 'Atoms/Prose/P',
  component: P
} satisfies Meta<typeof P>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children:
      'A paragraph of prose body text in serif at 17px / 175% line-height — comfortable for sustained reading inside articles.'
  }
};
