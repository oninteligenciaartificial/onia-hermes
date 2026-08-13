import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

/**
 * Sin robots.txt, cada rastreador decide solo y no hay forma de anunciar el
 * sitemap. Landing de una sola pagina: todo abierto, nada que esconder.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
