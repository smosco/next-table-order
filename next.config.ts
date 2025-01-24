import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'olo-images-live.imgix.net',
      },
    ],
  },
};

export default nextConfig;
