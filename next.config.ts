import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com', 'files.edgestore.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'files.edgestore.dev',
      },
    ],
  },
  typescript: {
    // Don't fail build on TS errors during deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Don't fail build on eslint errors during deployment
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;