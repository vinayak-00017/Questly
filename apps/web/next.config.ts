import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  transpilePackages: ["types", "utils"],
};
export default nextConfig;
