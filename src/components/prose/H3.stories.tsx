import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { H3 } from './H3';

const meta = {
  title: 'Atoms/Prose/H3',
  component: H3
} satisfies Meta<typeof H3>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Subsection heading' }
};
