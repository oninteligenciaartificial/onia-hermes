import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * `/v1` es el archivo de la web anterior (mismo copy, otras URLs): fuera del
 * índice o compite consigo misma. `/patrones` es la demo interna de patrones.
 * El resto del sitio SÍ se indexa — desde el 2026-08-21 la v3 es la web
 * publicada, no un preview.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/patrones", "/v1"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
