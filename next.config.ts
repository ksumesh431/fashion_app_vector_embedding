import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Allow next/image to optimize images from these external CDNs
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.myntassets.com",
      },
      {
        protocol: "https",
        hostname: "assets-jiocdn.ajio.com",
      },
      {
        protocol: "https",
        hostname: "cdn.platform.next",
      },
      {
        protocol: "https",
        hostname: "static.mercdn.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.jiomart.com",
      },
      {
        protocol: "https",
        hostname: "api.abercrombie.sa",
      },
    ],
  },
};

export default nextConfig;
