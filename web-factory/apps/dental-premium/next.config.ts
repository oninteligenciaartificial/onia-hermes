import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // standalone: se despliega igual que las otras apps del VPS sin sharp/CDN.
  output: "standalone",
  reactStrictMode: true,
};

export default nextConfig;
