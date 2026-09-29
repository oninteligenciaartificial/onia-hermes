import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * `/v1` es el archivo de la web anterior (mismo copy, otras URLs): fuera del
 * índice o compite consigo misma. `/patrones` es la demo interna de patrones.
 *
 * ⚠️ Acá había una tercera entrada, `/v4` —la exploración de portada del
 * 2026-09-07—, descrita en PRESENTE como algo «que se mira antes de decidir si
 * reemplaza a `/`». Esa decisión ya se tomó el mismo día: Sergio Urcullo dijo
 * «reemplazá la home con la v4», la exploración PASÓ a ser la portada y su
 * ruta se borró (`2c3ce027`). El commit que la borró dice, con todas las
 * letras, que `/v4` «sale del disallow de robots» — y no salió: quedó acá un
 * día entero prohibiéndole a los buscadores una URL que devuelve 404, y
 * describiendo una decisión pendiente que ya estaba tomada. Sale el 2026-09-08
 * con la barrida de citas de `/v4` (tarea `t_8e566d50`).
 *
 * Que el disallow sólo nombre rutas que EXISTEN lo verifica ahora
 * `ruta-citada.test.ts`: un disallow es la lista de páginas que el sitio dice
 * tener y no querer indexar, así que una entrada fantasma documenta una
 * pantalla que no está.
 * `/servicios/marketing-ia` y `/servicios/consultoria` salen del índice el
 * 2026-09-08 por decisión de Sergio Urcullo (tarea `t_30b1711d`): la navegación
 * pública es el sistema + Chatbot, porque los leads confunden la web con una
 * agencia. Al salir del menú se quedaron sin UNA sola pantalla que las enlace,
 * y una página que el sitio no ofrece pero pide indexar es la contradicción que
 * `alcance.test.ts` existe para evitar; ésta es la salida que ese gate documenta.
 * ⚠️ Desde el 2026-09-28 SÍ se bajan, junto con `/v1`: 308 a la portada
 * (`next.config.ts`, decisión de Sergio Urcullo). El disallow se queda porque
 * los fuentes siguen en el disco como sujetos de los gates de copy.
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
          "/servicios/marketing-ia",
          "/servicios/consultoria",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
