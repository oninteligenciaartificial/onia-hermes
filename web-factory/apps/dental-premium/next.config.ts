import type { NextConfig } from "next";
import path from "node:path";

// Raiz del workspace pnpm (web-factory/). Es desde donde Next traza los archivos
// del build standalone.
const monorepoRoot = path.resolve(process.cwd(), "../..");

const nextConfig: NextConfig = {
  // standalone: se despliega igual que las otras apps del VPS sin sharp/CDN.
  output: "standalone",

  /**
   * Sin esto el standalone es INDEPLOYABLE, y el build igual sale exit 0.
   *
   * Next infiere la raiz del trazado sola y, con las dependencias en la raiz del
   * monorepo, se va mas arriba que `web-factory/`: hornea la ruta ABSOLUTA del
   * checkout dentro del bundle. Medido el 2026-09-03 buildeando en el VPS, el
   * server.js quedo en
   * `.next/standalone/loops/onia-hermes-webfactory/web-factory/apps/dental-premium/`
   * en vez de `.next/standalone/apps/dental-premium/`.
   *
   * O sea: la ruta del server.js cambia segun DONDE se buildeo — otra en el
   * runner de CI, otra en cada worktree. Cualquier script de deploy copiado del
   * de onia.com.bo (que espera `standalone/apps/<app>/server.js`) falla, y falla
   * distinto en cada maquina. `outputFileTracingRoot` es lo que fija la ruta.
   */
  outputFileTracingRoot: monorepoRoot,

  reactStrictMode: true,
};

export default nextConfig;
