import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.CLOUD_STORAGE_HOSTNAME!,
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
