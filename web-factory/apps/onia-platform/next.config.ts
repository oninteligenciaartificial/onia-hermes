import type { NextConfig } from "next";
import path from "node:path";

// Raiz del monorepo. La usan dos cosas distintas: turbopack en desarrollo y el
// trazado de archivos del build standalone.
const monorepoRoot = path.resolve(process.cwd(), "../..");

const nextConfig: NextConfig = {
  turbopack: {
    root: monorepoRoot,
  },

  /**
   * `standalone` = la landing se autohospeda en el VPS, no en Vercel. Produce un
   * bundle con su propio server.js y solo las dependencias que realmente usa.
   *
   * OJO, leccion pagada con la app: este bundle hay que construirlo con webpack.
   * Con Turbopack, el standalone le pone un sufijo con hash a cada modulo
   * externo y en ejecucion ninguno resuelve, asi que TODAS las rutas devuelven
   * 500. En Vercel no se nota porque Vercel no usa este bundle: el fallo
   * aparece recien al auto-hospedar.
   *
   * En ESTA app (Next 15.5.19) webpack YA es el default de `next build`:
   * alcanza con `next build` a secas, y `--webpack` no existe como flag.
   * OJO: el producto (onia-platform, Next 16) es lo CONTRARIO — alla Turbopack
   * es el default y hay que pasar `--webpack` obligatorio (su standalone
   * hashea los modulos externos: incidente jul-2026, todas las rutas 500).
   * Dos apps, dos majors de Next, defaults opuestos. La clave `turbopack` de
   * arriba solo afecta a `next dev`.
   */
  output: "standalone",

  /**
   * En un monorepo hay que decir desde donde trazar, o el standalone sale sin
   * las dependencias que viven en la raiz.
   */
  outputFileTracingRoot: monorepoRoot,

  /**
   * URLs de la v1 que dejaron de existir el 2026-08-21 al publicar la v3.
   *
   * Las tres circulan: /prueba-gratis es el destino de firmas de correo y de
   * los CTA de las paginas viejas, /modulos/dental estaba en el sitemap desde
   * hace meses, y /funciones/facturacion-electronica-siat es la que capta la
   * busqueda del plazo del SIN. Un 404 en cualquiera de las tres es plata
   * perdida y autoridad tirada.
   *
   * `permanent: true` = 308: el buscador traslada la senal a la URL nueva y el
   * navegador cachea. Solo se usa donde el destino cubre la MISMA intencion.
   *
   * Ninguna choca con una pagina real: los archivos de esas rutas viven ahora
   * bajo /v1/... y siguen sirviendose desde ahi (noindex).
   */
  async redirects() {
    return [
      { source: "/prueba-gratis", destination: "/empezar", permanent: true },
      { source: "/modulos/dental", destination: "/rubros", permanent: true },
      { source: "/modulos", destination: "/rubros", permanent: true },
      {
        source: "/funciones/facturacion-electronica-siat",
        destination: "/facturacion",
        permanent: true,
      },
      // El preview interno del rediseno: se anuncio por interno y quedo en
      // historiales. Ahora ES el sitio.
      { source: "/preview", destination: "/", permanent: true },
      { source: "/preview/:ruta*", destination: "/:ruta*", permanent: true },
    ];
  },
};

export default nextConfig;
