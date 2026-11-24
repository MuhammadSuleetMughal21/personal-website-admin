import type { NextConfig } from "next";

// The admin is a private, always-fresh dashboard, so it uses classic dynamic
// rendering (no Cache Components): every page fetches live data from the site API.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
