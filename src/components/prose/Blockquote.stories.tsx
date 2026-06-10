import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Blockquote } from './Blockquote';
import { Hr } from './Hr';
import { P } from './P';

const meta = {
  title: 'Atoms/Prose/Blockquote-Hr'
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Quote: Story = {
  render: () => (
    <>
      <P>Before the quote.</P>
      <Blockquote>The point worth pausing on — generous serif, soft left rule.</Blockquote>
      <P>After the quote.</P>
      <Hr />
      <P>After the divider.</P>
    </>
  )
};
