import { dibujarTarjeta } from "../(sitio)/tarjeta-social";

/**
 * Tarjeta social de `/v1`, la gemela de la portada que producción sirve con
 * 200. Es el mismo dibujo de `(sitio)`: `opengraph-image` de Next aplica SÓLO
 * al `page.tsx` de su propio segmento, así que sin este archivo `/v1` se
 * quedaba con la captura de `/og/onia-rubros.jpg` — la que tiene «MUY PRONTO»
 * impreso adentro. El porqué medido está en `tarjeta-social.tsx`.
 */

export { alt, contentType, size } from "../(sitio)/tarjeta-social";

export default function Image() {
  return dibujarTarjeta();
}
