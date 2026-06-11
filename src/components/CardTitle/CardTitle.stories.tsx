import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { CardTitle } from './CardTitle';

const meta = {
  title: 'Atoms/CardTitle',
  component: CardTitle
} satisfies Meta<typeof CardTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Project name' }
};
