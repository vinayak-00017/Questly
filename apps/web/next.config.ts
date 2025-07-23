import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  transpilePackages: ["types", "utils"],

  // HTTPS-aware configuration - let Next.js auto-detect protocol from headers
  // Remove assetPrefix to allow Next.js to handle it automatically
  // The X-Forwarded-Proto header will tell Next.js the correct protocol

  eslint: {
    // Allow production builds to successfully complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to successfully complete even with TypeScript errors
    ignoreBuildErrors: true,
  },
};
export default nextConfig;
