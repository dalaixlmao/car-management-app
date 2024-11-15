import type { NextConfig } from "next";
//triggering redeployement
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "files.edgestore.dev"],
  },
};

export default nextConfig;
