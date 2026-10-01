import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Lo único que se le prohíbe al rastreador: `/patrones` (la demo interna de
 * patrones de UI, sin un solo enlace entrante) y `/api/` (los endpoints que
 * reciben formularios; no son páginas).
 *
 * ⚠️ 2026-09-29: salen del disallow `/v1`, `/servicios/marketing-ia` y
 * `/servicios/consultoria`. Desde el 2026-09-28 responden 308 a la portada
 * (`next.config.ts`, decisión de Sergio Urcullo), y un disallow le impide a
 * Google pedir esas URLs: nunca ve el 308, así que no traslada la señal ni las
 * saca del índice — quedan como «indexada aunque bloqueada por robots.txt». Para
 * que un buscador siga una redirección tiene que poder pedirla. Sus fuentes
 * siguen en el disco como sujeto de los gates de copy, pero nadie los sirve: los
 * gates que miran «lo que el sitio publica» ya restan también lo que
 * `next.config.ts` redirige (`PAGINAS_PUBLICAS`, `app/rutas.ts`).
 *
 * Historia que sigue valiendo: acá hubo un `/v4` que ya devolvía 404 y siguió
 * prohibido un día entero. Que el disallow sólo nombre rutas que EXISTEN lo
 * verifica `ruta-citada.test.ts`.
 *
 * ⚠️ `/servicios/webs` NO entra acá, y la diferencia importa: no es un enlace de
 * agencia perdido en un menú sino un ADD-ON con precio —«Web del negocio · desde
 * Bs 2.000, pago único», `ADDONS` de `lib/pricing.ts`— que la portada ofrece en
 * su cuerpo. Sigue publicada y en el sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/patrones", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
