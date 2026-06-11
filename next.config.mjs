import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
  experimental: {}
};

export default nextConfig;
