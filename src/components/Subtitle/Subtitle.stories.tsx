import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Subtitle } from './Subtitle';

const meta = {
  title: 'Atoms/Subtitle',
  component: Subtitle
} satisfies Meta<typeof Subtitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children:
      'I build calm, performant software. Currently writing about systems thinking and engineering leadership.'
  }
};
