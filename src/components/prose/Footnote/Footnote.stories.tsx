import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { P } from '../P';
import { FootnoteRef } from './FootnoteRef';
import { FootnoteSection } from './FootnoteSection';

const meta = {
  title: 'Prose/Footnote'
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <>
      <P>
        A claim that needs a citation<FootnoteRef>1</FootnoteRef>.
      </P>
      <FootnoteSection>
        <p>1. A footnote whose reference points back to the body.</p>
      </FootnoteSection>
    </>
  )
};
