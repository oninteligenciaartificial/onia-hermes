import type { MetadataRoute } from "next";

const SITE_URL = "https://onia.com.bo";

/**
 * Sitemap del sitio público. /patrones queda fuera (demo interna, noindex)
 * y /empezar entra (wizard público). Al crear una página nueva, agregarla
 * acá — regla del research: nunca una página publicada sin su entrada.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = [
    { path: "", priority: 1 },
    { path: "/precios", priority: 0.9 },
    { path: "/prueba-gratis", priority: 0.9 },
    { path: "/modulos/dental", priority: 0.8 },
    { path: "/funciones/facturacion-electronica-siat", priority: 0.8 },
    { path: "/comparativa", priority: 0.7 },
    { path: "/nosotros", priority: 0.6 },
    { path: "/empezar", priority: 0.6 },
    { path: "/terminos", priority: 0.3 },
    { path: "/privacidad", priority: 0.3 },
  ];
  return rutas.map((ruta) => ({
    url: `${SITE_URL}${ruta.path}`,
    changeFrequency: "weekly" as const,
    priority: ruta.priority,
  }));
}
