import Link from 'next/link';

import { CardTitle } from '@/components/CardTitle';
import { ListItem } from '@/components/ListItem';
import { StatusPill } from '@/components/StatusPill';
import { Text } from '@/components/Text';
import type { ClassName } from '@/lib/cn';
import type { Project } from '@/lib/content/types';

type Props = { project: Project; href?: string } & ClassName;

export const ProjectCard = ({ project, href, className }: Props) => (
  <ListItem className={className}>
    <Link
      href={href ?? `/projects/${project.slug}`}
      className="py-lg md:gap-lg hover:bg-surface gap-sm flex flex-col items-start transition-colors md:flex-row"
    >
      {project.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.coverImage}
          alt=""
          width={160}
          height={120}
          className="h-[120px] w-full shrink-0 rounded-md object-cover md:w-[160px]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="bg-surface h-[120px] w-full shrink-0 rounded-md md:w-[160px]"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="gap-xs flex flex-wrap items-center">
          <CardTitle className="text-fg leading-[1.3]">{project.title}</CardTitle>
          <StatusPill status={project.status} />
        </div>
        <Text tone="muted" className="mt-3xs">
          {project.tagline}
        </Text>
      </div>
    </Link>
  </ListItem>
);
