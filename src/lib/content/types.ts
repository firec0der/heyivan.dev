export type Article = {
  slug: string;
  title: string;
  date: string;
  description: string | null;
  draft: boolean;
  body: string;
  bodyHtml: string;
  readingTimeMinutes: number;
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  date: string;
  status: 'live' | 'archived' | 'wip';
  hero: string | null;
  stack: string[];
  links: {
    live?: string;
    appstore?: string;
    playstore?: string;
    source?: string;
  };
  bodyHtml: string;
};

export type Role = {
  company: string;
  role: string;
  start: number | string;
  end: number | string;
  blurb: string;
  description: string;
  skills: string[];
};

export type Education = {
  degree: string;
  institution: string;
  start: number;
  end: number;
};

export type WorkData = {
  roles: Role[];
  skills: Record<string, string>;
  education: Education[];
  cv_pdf: string;
};

export type SiteData = {
  name: string;
  wordmark: string;
  role: string;
  hero_greeting: string;
  social: {
    github: string;
    linkedin: string;
    email: string;
  };
};

export type AboutPage = {
  title: string;
  bodyHtml: string;
};
