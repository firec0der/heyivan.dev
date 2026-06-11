import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SkipLink } from './SkipLink';

const meta = {
  title: 'SkipLink',
  component: SkipLink,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof SkipLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Hidden (tab to reveal)',
  render: () => (
    <div className="bg-canvas text-fg p-md relative h-40 text-[14px]">
      <SkipLink />
      <p>Press Tab to reveal the skip link in the top-left corner.</p>
    </div>
  )
};

export const Visible: Story = {
  name: 'Visible (preview)',
  render: () => (
    <div className="bg-canvas text-fg p-md relative h-40 text-[14px]">
      <SkipLink className="translate-y-0" />
      <p>The link is force-shown so reviewers can compare against the design.</p>
    </div>
  )
};
