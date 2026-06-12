import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BackLink } from './BackLink';

const meta = {
  title: 'BackLink',
  component: BackLink
} satisfies Meta<typeof BackLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { href: '/writing', children: 'All writing' }
};
