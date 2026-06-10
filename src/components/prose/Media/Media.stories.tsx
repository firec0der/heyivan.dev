import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Figcaption } from './Figcaption';
import { Figure } from './Figure';
import { Img } from './Img';

const meta = {
  title: 'Atoms/Prose/Media'
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Plain: Story = {
  render: () => <Img src="https://placehold.co/680x360" alt="Placeholder" />
};

export const WithCaption: Story = {
  render: () => (
    <Figure>
      <Img src="https://placehold.co/680x360" alt="Placeholder" />
      <Figcaption>A caption that describes the image above.</Figcaption>
    </Figure>
  )
};
