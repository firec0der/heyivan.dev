import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Pre } from './Pre';

const meta = {
  title: 'Prose/Pre',
  component: Pre
} satisfies Meta<typeof Pre>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Pre>
      <code>{`function hello() {\n  return "world";\n}`}</code>
    </Pre>
  )
};
