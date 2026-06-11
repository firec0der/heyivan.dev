import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Li } from './Li';
import { Ol } from './Ol';
import { Ul } from './Ul';

const meta = {
  title: 'Prose/Lists'
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Unordered: Story = {
  render: () => (
    <Ul>
      <Li>First item — a short example of the unordered list.</Li>
      <Li>Second item — same indent and gap.</Li>
      <Li>Third item — final entry of the example list.</Li>
    </Ul>
  )
};

export const Ordered: Story = {
  render: () => (
    <Ol>
      <Li>First step — an example item for the ordered list.</Li>
      <Li>Second step — same shape as the first.</Li>
      <Li>Third step — final example.</Li>
    </Ol>
  )
};
