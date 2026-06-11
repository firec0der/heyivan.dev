import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { P } from '../P';
import { A } from './A';
import { Code } from './Code';
import { Del } from './Del';
import { Em } from './Em';
import { Kbd } from './Kbd';
import { Strong } from './Strong';

const meta = {
  title: 'Prose/Inline'
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Specimens: Story = {
  render: () => (
    <>
      <P>
        A paragraph with a <A href="#">link</A> inside.
      </P>
      <P>
        A paragraph with <Strong>bold emphasis</Strong> inside.
      </P>
      <P>
        A paragraph with <Em>italic emphasis</Em> inside.
      </P>
      <P>
        A paragraph with inline <Code>let x = 1</Code> inside.
      </P>
      <P>
        A paragraph with <Del>strikethrough</Del> text inside.
      </P>
      <P>
        Press <Kbd>Cmd</Kbd> to do the thing.
      </P>
    </>
  )
};
