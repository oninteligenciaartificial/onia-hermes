import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

/**
 * Hoy la landing es UNA sola pagina (el resto son anclas de la misma URL, y
 * una ancla no es una entrada de sitemap). Al publicar una ruta nueva
 * (/precios, /dental, un caso), agregarla aca: pagina publicada sin entrada en
 * el sitemap = pagina que el buscador encuentra tarde o no encuentra.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
