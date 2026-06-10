import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { H4 } from './H4';

const meta = {
  title: 'Atoms/Prose/H4',
  component: H4
} satisfies Meta<typeof H4>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Smaller heading' }
};
