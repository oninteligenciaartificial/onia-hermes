import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd(), "../.."),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hbderm.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  transpilePackages: ["@onia/blocks", "@onia/templates", "@onia/tokens"],
};

export default nextConfig;
