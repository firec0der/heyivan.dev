import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SectionLabel } from './SectionLabel';

const meta = {
  title: 'SectionLabel',
  component: SectionLabel
} satisfies Meta<typeof SectionLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Latest writing' }
};
