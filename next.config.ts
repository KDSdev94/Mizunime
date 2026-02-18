import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v3.animekompi.fun',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'i1.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'i2.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'i3.wp.com',
      },
      {
        protocol: 'http',
        hostname: 'v3.animekompi.fun',
      },
      {
        protocol: 'https',
        hostname: 'v5.animekompi.fun',
      },
      {
        protocol: 'http',
        hostname: 'v5.animekompi.fun',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: '185.224.82.193',
      },
    ],
  },
};

export default nextConfig;
