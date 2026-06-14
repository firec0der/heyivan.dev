import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import type { Role } from '@/lib/content/types';

import { RoleCard } from './RoleCard';

const SAMPLE_ROLE: Role = {
  company: 'Company Name',
  role: 'Senior Engineer',
  start: '2022-09',
  end: 'present',
  blurb: 'One-line summary of what this role is about.',
  description: `Led a backend team building distributed data pipelines. Owned the on-call rotation, the post-incident process, and the move to a deploy-by-default workflow that took median MTTR from twenty minutes to under three.

Drove the migration off a legacy job scheduler to a queue-based architecture without a maintenance window — incremental, dual-write, then cutover. Wrote the runbooks and trained the team on the new system.`,
  skills: ['Go', 'Python', 'Postgres', 'Kubernetes', 'AWS']
};

const meta = {
  title: 'RoleCard',
  component: RoleCard,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-content mx-auto">
        <Story />
      </div>
    )
  ],
  args: { role: SAMPLE_ROLE }
} satisfies Meta<typeof RoleCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Open: Story = { args: { defaultOpen: true } };

export const WithoutSkills: Story = {
  args: {
    defaultOpen: true,
    role: { ...SAMPLE_ROLE, skills: [] }
  }
};
