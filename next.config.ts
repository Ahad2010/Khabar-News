import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The site used to live under /en and /ur; it is now English-only at the
    // root. 301 the old URLs so search engines transfer ranking signals.
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
      { source: "/ur", destination: "/", permanent: true },
      { source: "/ur/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
