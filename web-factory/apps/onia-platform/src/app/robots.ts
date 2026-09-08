import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * `/v1` es el archivo de la web anterior (mismo copy, otras URLs): fuera del
 * índice o compite consigo misma. `/patrones` es la demo interna de patrones,
 * y `/v4` la exploración de portada del 2026-09-07 (estructura de Fincash),
 * que se mira antes de decidir si reemplaza a `/` — hasta entonces no compite
 * con la home en ningún buscador.
 * `/servicios/marketing-ia` y `/servicios/consultoria` salen del índice el
 * 2026-09-08 por decisión de Sergio Urcullo (tarea `t_30b1711d`): la navegación
 * pública es el sistema + Chatbot, porque los leads confunden la web con una
 * agencia. Al salir del menú se quedaron sin UNA sola pantalla que las enlace,
 * y una página que el sitio no ofrece pero pide indexar es la contradicción que
 * `alcance.test.ts` existe para evitar; ésta es la salida que ese gate documenta.
 * **No se bajan**: siguen respondiendo 200, así que una URL que ya circula sigue
 * abriendo y se puede mandar en una venta.
 *
 * ⚠️ `/servicios/webs` NO entra acá, y la diferencia importa: no es un enlace de
 * agencia perdido en un menú sino un ADD-ON con precio —«Web del negocio · desde
 * Bs 2.000, pago único», `ADDONS` de `lib/pricing.ts`— que la portada ofrece en
 * su cuerpo. Sigue publicada y en el sitemap: desindexar lo que la home vende
 * con su precio al lado sería que el sitio se contradiga solo.
 * El resto del sitio SÍ se indexa — desde el 2026-08-21 la v3 es la web
 * publicada, no un preview.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/patrones",
          "/v1",
          "/v4",
          "/servicios/marketing-ia",
          "/servicios/consultoria",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
