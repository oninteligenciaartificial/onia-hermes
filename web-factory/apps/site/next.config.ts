import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd(), "../.."),
  },
  transpilePackages: ["@onia/blocks", "@onia/templates", "@onia/tokens"],
};

export default nextConfig;
