import { dibujarTarjeta } from "./tarjeta-social";

/**
 * Tarjeta social de la home. El dibujo vive en `tarjeta-social.tsx` porque
 * `opengraph-image` de Next aplica SÓLO al `page.tsx` de su propio segmento:
 * cada ruta de `(sitio)` necesita su copia de este archivo o sale sin imagen.
 * El porqué medido está en la cabecera de `tarjeta-social.tsx`.
 */

export { alt, contentType, size } from "./tarjeta-social";

export default function Image() {
  return dibujarTarjeta();
}
