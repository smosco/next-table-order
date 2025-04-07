import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

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

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
