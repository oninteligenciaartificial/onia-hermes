import type { MetadataRoute } from "next";

// No existia: robots.txt devolvia 404, o sea barra libre para cualquier crawler.
// /vendedores/* y /factory publican material interno — precios viejos y una clinica
// de ejemplo — que no tiene por que aparecer en un buscador.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/vendedores", "/vendedores/", "/factory", "/onia-center"] }],
  };
}
