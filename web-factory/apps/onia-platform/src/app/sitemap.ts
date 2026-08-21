import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Sitemap del sitio público. Al crear una página nueva, agregarla acá — regla
 * del research: nunca una página publicada sin su entrada.
 *
 * Fuera quedan `/patrones` (demo interna) y todo `/v1` (archivo de la web
 * anterior, noindex). Las tres URLs de la v1 que dejaron de existir
 * —/prueba-gratis, /modulos/dental y /funciones/facturacion-electronica-siat—
 * salieron del sitemap porque ahora son redirecciones 308; sus destinos
 * (/empezar, /rubros, /facturacion) sí están.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = [
    { path: "", priority: 1 },
    { path: "/precios", priority: 0.9 },
    { path: "/empezar", priority: 0.9 },
    { path: "/rubros", priority: 0.8 },
    { path: "/chatbot", priority: 0.8 },
    { path: "/agentes", priority: 0.8 },
    { path: "/facturacion", priority: 0.8 },
    { path: "/servicios/webs", priority: 0.8 },
    { path: "/comparativa", priority: 0.7 },
    { path: "/contacto", priority: 0.7 },
    { path: "/nosotros", priority: 0.6 },
    { path: "/servicios/marketing-ia", priority: 0.6 },
    { path: "/servicios/consultoria", priority: 0.6 },
    { path: "/terminos", priority: 0.3 },
    { path: "/privacidad", priority: 0.3 },
  ];
  return rutas.map((ruta) => ({
    url: `${SITE_URL}${ruta.path}`,
    changeFrequency: "weekly" as const,
    priority: ruta.priority,
  }));
}
