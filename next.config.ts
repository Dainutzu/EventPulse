import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ],
    minimumCacheTTL: 60,
  },
  reactStrictMode: true,
};

export default nextConfig;
