import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import type { Project } from '@/lib/content/types';

import { ProjectCard } from './ProjectCard';

const SAMPLE_COVER =
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=320&h=240&fit=crop&q=80';

const baseProject: Project = {
  slug: 'example-app',
  title: 'Example App',
  tagline: 'A native mobile app for tracking long-running side projects.',
  date: '2024-03-15',
  status: 'live',
  coverImage: SAMPLE_COVER,
  stack: ['React Native', 'TypeScript', 'Postgres'],
  links: { live: 'https://example-app.com' },
  body: '',
  fallback: false
};

const meta = {
  title: 'ProjectCard',
  component: ProjectCard,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-content mx-auto">
        <ul className="border-border list-none border-t p-0">
          <Story />
        </ul>
      </div>
    )
  ]
} satisfies Meta<typeof ProjectCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Live: Story = {
  args: { project: baseProject }
};

export const Archived: Story = {
  args: {
    project: {
      ...baseProject,
      slug: 'old-thing',
      title: 'Old Thing',
      status: 'archived',
      tagline: 'A side project that ran its course; left up for posterity.'
    }
  }
};

export const Wip: Story = {
  args: {
    project: {
      ...baseProject,
      slug: 'new-thing',
      title: 'New Thing',
      status: 'wip',
      coverImage: null,
      tagline: 'Still cooking. No cover image yet, so the placeholder renders.'
    }
  }
};
