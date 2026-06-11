'use client';

import { useId, useState } from 'react';

import { type ClassName, cn } from '@/lib/cn';
import type { Role } from '@/lib/content/types';
import { formatYearRange } from '@/lib/format';

type Props = {
  role: Role;
  defaultOpen?: boolean;
} & ClassName;

export const RoleCard = ({ role, defaultOpen = false, className }: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const regionId = useId();

  return (
    <article className={cn('border-border border-b last:border-b-0', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => setOpen((v) => !v)}
        className="py-sm gap-sm flex w-full flex-col text-left"
      >
        <div className="flex items-baseline justify-between">
          <span className="text-faint font-mono text-[13px] leading-[1.5]">
            {formatYearRange(role.start, role.end)}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              'text-muted inline-block text-[14px] leading-[1.6] transition-transform duration-[var(--motion-duration-base)] ease-[var(--motion-easing-standard)]',
              open && 'rotate-180'
            )}
          >
            ▾
          </span>
        </div>
        <span className="text-fg text-[16px] leading-[1.6]">
          {role.role} · {role.company}
        </span>
        <span className="text-muted text-[14px] leading-[1.6]">{role.blurb}</span>
      </button>
      <div
        id={regionId}
        role="region"
        aria-label={`${role.role} at ${role.company} details`}
        className={cn(
          'grid transition-[grid-template-rows] duration-[var(--motion-duration-slow)] ease-[var(--motion-easing-standard)]',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
        inert={!open}
      >
        <div className="overflow-hidden">
          <div className="gap-md pb-lg flex flex-col">
            <div className="text-fg text-[14px] leading-[1.6]">
              {role.description.split(/\n\n+/).map((p, i) => (
                <p key={i} className="mb-sm last:mb-0">
                  {p}
                </p>
              ))}
            </div>
            {role.skills.length > 0 ? (
              <div>
                <span className="text-faint block text-[11px] font-medium tracking-[1.2px]">
                  SKILLS
                </span>
                <span className="text-muted mt-3xs block font-mono text-[13px] leading-[1.5]">
                  {role.skills.join(' · ')}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
};
