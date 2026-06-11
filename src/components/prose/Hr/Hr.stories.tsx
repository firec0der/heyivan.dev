import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { P } from '../P';
import { Hr } from './Hr';

const meta = {
  title: 'Prose/Hr'
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <>
      <P>Before the divider.</P>
      <Hr />
      <P>After the divider.</P>
    </>
  )
};
