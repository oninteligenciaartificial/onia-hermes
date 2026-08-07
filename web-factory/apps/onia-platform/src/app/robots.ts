import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/patrones"] }],
    sitemap: "https://onia.com.bo/sitemap.xml",
  };
}
