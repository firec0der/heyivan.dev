import Link from 'next/link';

import { StatusPill } from '@/components/StatusPill';
import { type ClassName, cn } from '@/lib/cn';
import type { Project } from '@/lib/content/types';

type Props = { project: Project } & ClassName;

export const ProjectCard = ({ project, className }: Props) => (
  <li className={cn('border-border border-b last:border-b-0', className)}>
    <Link
      href={`/projects/${project.slug}`}
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
          <h3 className="text-fg text-[18px] leading-[1.3] font-semibold">{project.title}</h3>
          <StatusPill status={project.status} />
        </div>
        <p className="text-muted mt-3xs text-[16px] leading-[1.6]">{project.tagline}</p>
      </div>
    </Link>
  </li>
);
