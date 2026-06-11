import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { StatusPill } from './StatusPill';

const meta = {
  title: 'Atoms/StatusPill',
  component: StatusPill,
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['live', 'archived', 'wip']
    }
  }
} satisfies Meta<typeof StatusPill>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Live: Story = { args: { status: 'live' } };
export const Archived: Story = { args: { status: 'archived' } };
export const Wip: Story = { args: { status: 'wip' } };
