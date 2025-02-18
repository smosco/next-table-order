import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'olo-images-live.imgix.net',
      },
      {
        protocol: 'https',
        hostname: 'phihwugemohmclgfnycr.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
};

export default nextConfig;
