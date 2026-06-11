import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ThemeToggle } from './ThemeToggle';

const meta = {
  title: 'ThemeToggle',
  component: ThemeToggle
} satisfies Meta<typeof ThemeToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Toggle (use Storybook toolbar to switch theme)'
};
