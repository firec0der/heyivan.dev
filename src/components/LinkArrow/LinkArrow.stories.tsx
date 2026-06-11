import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { LinkArrow } from './LinkArrow';

const meta = {
  title: 'LinkArrow',
  component: LinkArrow,
  argTypes: {
    direction: { control: 'inline-radio', options: ['forward', 'back'] },
    external: { control: 'boolean' }
  }
} satisfies Meta<typeof LinkArrow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Forward: Story = {
  args: { href: '/work', children: 'See selected work' }
};

export const Back: Story = {
  args: { href: '/writing', direction: 'back', children: 'Back to all writing' }
};

export const External: Story = {
  args: { href: 'https://github.com/firec0der', external: true, children: 'github.com/firec0der' }
};
