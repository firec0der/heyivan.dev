import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MetaRow } from './MetaRow';

const meta = {
  title: 'MetaRow',
  component: MetaRow
} satisfies Meta<typeof MetaRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    meta: '2026-06-12',
    children: 'The event loop, observed from the inside'
  }
};

export const YearRange: Story = {
  args: {
    meta: '2014 — 2018',
    children: 'BSc Computer Science, Example University'
  }
};
