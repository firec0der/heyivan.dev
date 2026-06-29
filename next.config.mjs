import path from 'node:path';
import { fileURLToPath } from 'node:url';

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
  experimental: {},
  ...(process.env.NODE_ENV === 'development' && {
    async redirects() {
      return [
        { source: '/', destination: '/en', permanent: false },
        {
          source: '/:path((?!en|uk|_next|favicon).*)',
          destination: '/en/:path',
          permanent: false
        }
      ];
    }
  })
};

export default withNextIntl(nextConfig);
