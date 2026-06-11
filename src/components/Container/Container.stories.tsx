import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Container } from './Container';

const meta = {
  title: 'Container',
  component: Container,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    width: { control: 'inline-radio', options: ['content', 'article'] }
  }
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Content: Story = {
  args: {
    width: 'content',
    children: (
      <div className="bg-surface text-fg p-md font-serif text-[16px] leading-[1.6]">
        max-w-content (640px) — the default for chrome surfaces and most pages.
      </div>
    )
  }
};

export const Article: Story = {
  args: {
    width: 'article',
    children: (
      <div className="bg-surface text-fg p-md font-serif text-[17px] leading-[1.75]">
        max-w-article (680px) — the slightly wider measure used by the long-form writing page.
      </div>
    )
  }
};
