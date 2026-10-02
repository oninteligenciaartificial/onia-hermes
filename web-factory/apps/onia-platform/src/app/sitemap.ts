import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Sitemap del sitio público. Al crear una página nueva **que quieras en el
 * buscador**, agregarla acá — regla del research: nunca una página indexable
 * sin su entrada.
 *
 * Fuera quedan `/patrones` (demo interna) y todo `/v1` (archivo de la web
 * anterior: desde el 2026-09-28, 308 a la portada). Las tres URLs de la v1 que dejaron de existir
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
 *
 * `lastModified` es la fecha del BUILD, no una fecha por página. El sitemap se
 * genera estático al construir, y el publicador arma ese build desde un
 * `git archive` de `web-factory` (`scripts/loops/extras/publicar-solo.sh`), que
 * no trae `.git`: la fecha de cada `page.tsx` no se le puede preguntar a git
 * ahí, y el `mtime` de lo extraído es la hora de la extracción. La fecha del
 * build es la única que se sabe cierta: el sitio publicado cambió ese día.
 * Sin `changefreq` ni `priority`: Google ignora los dos.
 */
const CONSTRUIDO = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = [
    { path: "" },
    { path: "/precios" },
    { path: "/empezar" },
    { path: "/rubros" },
    { path: "/chatbot" },
    { path: "/agentes" },
    { path: "/facturacion" },
    { path: "/guia-facturacion" },
    { path: "/servicios/webs" },
    { path: "/comparativa" },
    { path: "/contacto" },
    { path: "/nosotros" },
    // `/privacidad` sí va: es indexable a propósito —el rastreador de Meta
    // valida esa URL al publicar la app del chatbot—. `/terminos` NO, porque
    // declara `noindex`; ver el aviso de arriba.
    { path: "/privacidad" },
  ];
  return rutas.map(({ path }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: CONSTRUIDO,
  }));
}
