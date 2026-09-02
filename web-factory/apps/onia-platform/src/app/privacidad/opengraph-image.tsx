import { dibujarTarjeta } from "@/app/(sitio)/tarjeta-social";

/**
 * Esta ruta vive FUERA del grupo `(sitio)`, y por eso se quedó sin tarjeta
 * cuando se les puso una a las doce de adentro: `opengraph-image` aplica al
 * `page.tsx` de su propio segmento y no cruza grupos de rutas. Está en el
 * sitemap —o sea, la publicamos— así que se comparte con el mismo dibujo que
 * el resto del sitio. Lo vigila `(sitio)/forma.test.ts`, que ahora enumera el
 * sitemap y no la carpeta.
 */

export { alt, contentType, size } from "@/app/(sitio)/tarjeta-social";

export default function Image() {
  return dibujarTarjeta();
}
