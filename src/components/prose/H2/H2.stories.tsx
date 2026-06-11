import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { H2 } from './H2';

const meta = {
  title: 'Prose/H2',
  component: H2
} satisfies Meta<typeof H2>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Section heading' }
};
