import type { NextConfig } from "next";
import path from "node:path";

const standaloneBuild = process.env.ONIA_STANDALONE_BUILD === "true";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd(), "../.."),
  },
  transpilePackages: ["@onia/blocks", "@onia/templates", "@onia/tokens"],
};

if (standaloneBuild) {
  nextConfig.output = "standalone";
  nextConfig.outputFileTracingRoot = path.resolve(process.cwd(), "../..");
}

export default nextConfig;
