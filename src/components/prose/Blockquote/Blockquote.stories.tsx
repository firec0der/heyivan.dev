import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { P } from '../P';
import { Blockquote } from './Blockquote';

const meta = {
  title: 'Prose/Blockquote'
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <>
      <P>Before the quote.</P>
      <Blockquote>The point worth pausing on — generous serif, soft left rule.</Blockquote>
      <P>After the quote.</P>
    </>
  )
};
