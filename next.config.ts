import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/open/:token", destination: "/c/:token", permanent: false },
      { source: "/en/open/:token", destination: "/en/c/:token", permanent: false },
    ];
  },
};

export default nextConfig;
