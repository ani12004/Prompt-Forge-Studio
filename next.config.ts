import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  async redirects() {
    return [
      {
        source: '/profile',
        destination: '/settings',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
