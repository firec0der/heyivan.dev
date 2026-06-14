export type Article = {
  slug: string;
  title: string;
  date: string;
  description: string | null;
  draft: boolean;
  body: string;
  readingTimeMinutes: number;
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  date: string;
  status: 'live' | 'archived' | 'wip';
  coverImage: string | null;
  stack: string[];
  links: {
    live?: string;
    appstore?: string;
    playstore?: string;
    source?: string;
  };
  body: string;
};

export type Role = {
  company: string;
  role: string;
  // 'YYYY-MM' month strings; end may be the literal 'present'.
  start: string;
  end: string;
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

export type SocialLinks = {
  github: string;
  linkedin: string;
  email: string;
};

export type SiteData = {
  name: string;
  wordmark: string;
  role: string;
  greeting: string;
  social: SocialLinks;
};
