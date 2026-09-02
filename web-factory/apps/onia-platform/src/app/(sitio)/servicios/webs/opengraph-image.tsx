import { dibujarTarjeta } from "../../tarjeta-social";

/**
 * `opengraph-image` de Next aplica SÓLO al `page.tsx` de su propio segmento: sin
 * este archivo, esta ruta se comparte por WhatsApp sin una sola imagen. El
 * dibujo es el mismo de todo el sitio y vive en `tarjeta-social.tsx`.
 */

export { alt, contentType, size } from "../../tarjeta-social";

export default function Image() {
  return dibujarTarjeta();
}
