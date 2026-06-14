import { type ClassName, cn } from '@/lib/cn';
import type { SocialLinks } from '@/lib/content/types';

type Props = { socialLinks: SocialLinks } & ClassName;

export const Footer = ({ socialLinks, className }: Props) => (
  <footer className={cn('border-border mt-5xl border-t', className)}>
    <div className="text-muted px-lg py-xl md:px-4xl gap-xs mx-auto flex w-full max-w-[1440px] flex-col items-start text-[12px] md:flex-row md:items-center md:justify-between">
      <div className="gap-sm flex flex-wrap items-center">
        <a
          href={socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-fg"
        >
          github
        </a>
        <span aria-hidden="true">·</span>
        <a
          href={socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-fg"
        >
          linkedin
        </a>
        <span aria-hidden="true">·</span>
        <a href={`mailto:${socialLinks.email}`} className="hover:text-fg">
          email
        </a>
      </div>
      <div>© {new Date().getFullYear()}</div>
    </div>
  </footer>
);
