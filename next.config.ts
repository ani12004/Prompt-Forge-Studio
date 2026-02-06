import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://clerk.prompt-forge-studio.netlify.app https://casual-marlin-43.clerk.accounts.dev https://img.clerk.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://img.clerk.com https://i.ytimg.com; font-src 'self'; connect-src 'self' https://clerk.prompt-forge-studio.netlify.app https://casual-marlin-43.clerk.accounts.dev https://img.clerk.com; frame-src 'self' https://challenges.cloudflare.com;"
          }
        ],
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
