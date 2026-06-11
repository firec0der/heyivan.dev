import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Avatar } from './Avatar';

const SAMPLE_SRC =
  'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=240&h=240&fit=crop&q=80';

const meta = {
  title: 'Avatar',
  component: Avatar,
  args: { src: SAMPLE_SRC, alt: 'Portrait of Ivan' },
  argTypes: {
    size: { control: 'inline-radio', options: [96, 120] }
  }
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Small: Story = { args: { size: 96 } };
export const Large: Story = { args: { size: 120 } };
