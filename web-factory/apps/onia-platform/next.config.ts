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
   * En Next 15.5.19 webpack YA es el default de `next build`: alcanza con
   * `next build` a secas. Turbopack es opt-in via `--turbopack`, asi que lo
   * que hay que hacer es NO pasar ese flag. (`--webpack` no existe como flag;
   * pasarlo falla.) La clave `turbopack` de arriba solo afecta a `next dev`.
   */
  output: "standalone",

  /**
   * En un monorepo hay que decir desde donde trazar, o el standalone sale sin
   * las dependencias que viven en la raiz.
   */
  outputFileTracingRoot: monorepoRoot,
};

export default nextConfig;
