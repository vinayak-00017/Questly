import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  transpilePackages: ["types", "utils"],
  // Configure for HTTPS production deployment
  assetPrefix: process.env.NODE_ENV === "production" ? "https://questly.me" : undefined,
  // Remove standalone output for now
  // output: "standalone",
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
