import type { Metadata } from 'next';

export const alternatesFor = (path: string): Metadata['alternates'] => {
  const suffix = path === '/' ? '' : path;
  return {
    languages: {
      en: `/en${suffix}`,
      uk: `/uk${suffix}`,
      'x-default': `/en${suffix}`
    }
  };
};
