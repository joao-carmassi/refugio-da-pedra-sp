import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: true,
  experimental: {
    typedEnv: true,
  },
  images: {
    qualities: [100],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
