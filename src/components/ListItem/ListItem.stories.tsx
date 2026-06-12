import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ListItem } from './ListItem';

const meta = {
  title: 'ListItem',
  component: ListItem
} satisfies Meta<typeof ListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const InList: Story = {
  render: () => (
    <ul className="list-none p-0">
      <ListItem className="py-sm">First row</ListItem>
      <ListItem className="py-sm">Second row</ListItem>
      <ListItem className="py-sm">Last row has no border</ListItem>
    </ul>
  )
};
