import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Label } from './Label';

const meta = {
  title: 'Atoms/Typography/Label',
  component: Label
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Live' }
};
