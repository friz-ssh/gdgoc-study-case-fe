import type { NextConfig } from "next";

/**
 * The GDGoC UGM REST API lives on a different origin. Requests from the
 * browser go to `/gdgoc-api/*` on our own origin and Next.js forwards them
 * (a rewrite), which means:
 *   - no CORS configuration is needed on the API side
 *   - the upstream URL can be changed with one environment variable
 */
const UPSTREAM_API = (
  process.env.GDGOC_API_UPSTREAM ?? "https://gdgoc-ugm-api.vercel.app/api"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/gdgoc-api/:path*",
        destination: `${UPSTREAM_API}/:path*`,
      },
    ];
  },
};

export default nextConfig;
