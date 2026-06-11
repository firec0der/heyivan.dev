import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { EducationRow } from './EducationRow';

const meta = {
  title: 'EducationRow',
  component: EducationRow,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <ul className="border-border min-w-[480px] list-none border-t p-0">
        <Story />
      </ul>
    )
  ]
} satisfies Meta<typeof EducationRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    start: 2018,
    end: 2020,
    degree: 'MSc Computer Science',
    institution: 'University Name'
  }
};

export const LongDegree: Story = {
  args: {
    start: 2014,
    end: 2018,
    degree:
      'BSc Honours in Computer Science with a Concentration in Distributed Systems and Programming Language Theory',
    institution: 'Some Polytechnic Institution With A Long Name'
  }
};
