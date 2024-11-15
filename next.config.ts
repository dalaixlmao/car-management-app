import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com', 'files.edgestore.dev'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  distDir: '.next',
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
    };
  },
};

export default nextConfig;