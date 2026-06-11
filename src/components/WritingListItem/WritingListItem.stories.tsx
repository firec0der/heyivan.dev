import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { WritingListItem } from './WritingListItem';

const meta = {
  title: 'WritingListItem',
  component: WritingListItem,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <ul className="border-border min-w-[480px] list-none border-t p-0">
        <Story />
      </ul>
    )
  ]
} satisfies Meta<typeof WritingListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    slug: 'the-monorepo-trap',
    title: 'The monorepo trap, and how an engineering org of forty people walked right into it',
    date: '2026-03-22'
  }
};

export const Short: Story = {
  args: {
    slug: 'hello-world',
    title: 'Hello, world.',
    date: '2026-01-08'
  }
};

export const LongMultiline: Story = {
  args: {
    slug: 'why-i-stopped-writing-down-monolithic-multi-clause-essay-titles',
    title:
      'Why I stopped writing down monolithic, multi-clause essay titles that try to summarize the entire argument in one breath, and what I do instead when the first draft of a title runs to thirty-five words and three subordinate clauses',
    date: '2026-04-15'
  }
};
