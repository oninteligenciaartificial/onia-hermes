import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Sitemap del sitio público. Al crear una página nueva **que quieras en el
 * buscador**, agregarla acá — regla del research: nunca una página indexable
 * sin su entrada.
 *
 * Fuera quedan `/patrones` (demo interna) y todo `/v1` (archivo de la web
 * anterior, noindex). Las tres URLs de la v1 que dejaron de existir
 * —/prueba-gratis, /modulos/dental y /funciones/facturacion-electronica-siat—
 * salieron del sitemap porque ahora son redirecciones 308; sus destinos
 * (/empezar, /rubros, /facturacion) sí están.
 *
 * ⚠️ **"Publicada" no es "indexable"**, y confundirlas dejó una contradicción
 * viva: `/terminos` estaba en esta lista declarando `robots: { index: false }`
 * en su propia página. Un sitemap no enumera contenidos, **pide indexación**,
 * así que el sitio se desmentía solo y Search Console lo reporta como error
 * (*"Submitted URL marked 'noindex'"*), gastando rastreo en una página que
 * nosotros mismos excluimos. Sale de acá y no pierde nada: sigue publicada,
 * enlazada desde el pie y compartible con su propia tarjeta.
 * Lo mide `indexar.test.ts`, que corre en `prebuild`.
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
    { path: "/guia-facturacion", priority: 0.8 },
    { path: "/servicios/webs", priority: 0.8 },
    { path: "/comparativa", priority: 0.7 },
    { path: "/contacto", priority: 0.7 },
    { path: "/nosotros", priority: 0.6 },
    { path: "/servicios/marketing-ia", priority: 0.6 },
    { path: "/servicios/consultoria", priority: 0.6 },
    // `/privacidad` sí va: es indexable a propósito —el rastreador de Meta
    // valida esa URL al publicar la app del chatbot—. `/terminos` NO, porque
    // declara `noindex`; ver el aviso de arriba.
    { path: "/privacidad", priority: 0.3 },
  ];
  return rutas.map((ruta) => ({
    url: `${SITE_URL}${ruta.path}`,
    changeFrequency: "weekly" as const,
    priority: ruta.priority,
  }));
}
