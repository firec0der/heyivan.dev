import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Text } from './Text';

const meta = {
  title: 'Text',
  component: Text,
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['default', 'muted']
    }
  }
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

const SAMPLE =
  'The quick brown fox jumps over the lazy dog. This is the base body treatment used for descriptions, article blurbs, and prose.';

export const Default: Story = {
  args: { children: SAMPLE, tone: 'default' }
};

export const Muted: Story = {
  args: { children: SAMPLE, tone: 'muted' }
};
