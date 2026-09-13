import { dibujarTarjeta } from "../../../(sitio)/tarjeta-social";

/**
 * Tarjeta social de `/v1/funciones/facturacion-electronica-siat`. `opengraph-image` de Next aplica SÓLO al
 * `page.tsx` de su propio segmento y no baja a los anidados: sin este archivo
 * la ruta se comparte por WhatsApp sin una sola imagen, aunque producción la
 * sirva con 200 y `/v1` sí tenga la suya. El dibujo es el mismo de todo el
 * sitio y el porqué medido está en `tarjeta-social.tsx`.
 */

export { alt, contentType, size } from "../../../(sitio)/tarjeta-social";

export default function Image() {
  return dibujarTarjeta();
}
