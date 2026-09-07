import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: process.env.SITE_BASE_PATH || '',
  trailingSlash: true,
};

export default nextConfig;
