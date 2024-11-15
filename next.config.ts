import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com', 'files.edgestore.dev'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  distDir: '.next',
};

export default nextConfig;