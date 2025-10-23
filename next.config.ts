import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'places.googleapis.com'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'mma.prnewswire.com'
      },
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com'
      }
    ]
  }
};

export default nextConfig;
