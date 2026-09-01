import { escapeAttribute, escapeHtml } from "./escape";

/**
 * marquee — cinta infinita de reseñas, logos o sponsors.
 *
 * T29 del catálogo (`docs/WEB_FACTORY_TECNICAS_2026.md`), anclada en 6 sitios
 * (frequencybreathwork, amritpalace, clay, unitedcarriers, ogaki, leoff) y parte
 * del "piso de toda web de cliente" junto a statement-full y stat-rows.
 *
 * Mecanismo verbatim del catálogo: la lista se renderiza DOS veces en un track y
 * se anima `translateX(0 -> -50%)`; al llegar a -50% el segundo set está exacto
 * donde arrancó el primero, así que el loop no salta. CSS puro, cero JS.
 *
 * Dos detalles que decide el código y no el comentario:
 *  - **La separación es padding del ítem, no `gap` del track.** Con `gap` el
 *    track mide `2S + (2n-1)g` y la mitad exacta cae medio gap corrida: el
 *    salto que esta técnica existe para evitar. Con padding cada set mide lo
 *    mismo y -50% es exacto.
 *  - **El segundo set es `aria-hidden`**: es una copia visual, y sin eso un
 *    lector de pantalla lee dos veces cada reseña.
 *
 * Accesibilidad de movimiento (WCAG 2.2.2): la cinta se pausa en `:hover` y en
 * `:focus-within` — el hover solo no alcanza para quien navega con teclado — y
 * bajo `prefers-reduced-motion` no se mueve y el contenedor pasa a scroll
 * manual, así el contenido sigue siendo alcanzable en vez de quedar cortado.
 */

export type MarqueeProps = {
  /** Cada línea tal cual va en pantalla. Sin ítems no hay cinta. */
  items: ReadonlyArray<string>;
  /** Nombre accesible de la región. */
  label?: string;
  /**
   * Vuelta completa en segundos. Por defecto escala con la cantidad de ítems
   * (~6 s por ítem, piso 18 s) para que la velocidad percibida no dependa de
   * cuántos textos cargó el cliente.
   */
  segundos?: number;
  direccion?: "izquierda" | "derecha";
  id?: string;
};

export function renderMarquee({
  items,
  label,
  segundos,
  direccion = "izquierda",
  id = "cinta",
}: MarqueeProps): string {
  const clean = items.map((item) => item.trim()).filter(Boolean);
  if (clean.length === 0) return "";

  const duration = Math.max(18, segundos ?? clean.length * 6);
  const cells = clean
    .map((item) => `<li class="wf-marquee-item">${escapeHtml(item)}</li>`)
    .join("");

  return `
    <section class="wf-marquee" id="${escapeAttribute(id)}" aria-label="${escapeAttribute(label?.trim() || "Reseñas")}" style="--wf-marquee-dur:${duration}s">
      <ul class="wf-marquee-track${direccion === "derecha" ? " wf-marquee-rtl" : ""}">
        ${cells}
        <li class="wf-marquee-clone" aria-hidden="true"><ul class="wf-marquee-set">${cells}</ul></li>
      </ul>
    </section>
  `;
}

/**
 * Estilos solo con tokens: ningún color literal, así la cinta lee bien en
 * cualquier marca y en el scope oscuro que emite @onia/tokens.
 * Nota: sin backticks en los comentarios -- esto vive dentro de un template
 * literal y uno suelto corta la hoja a la mitad.
 */
export const MARQUEE_CSS = `
.wf-marquee {
  --wf-marquee-gap: clamp(28px, 4vw, 56px);
  overflow: hidden;
  padding: clamp(28px, 4vw, 48px) 0;
  border-block: 1px solid color-mix(in srgb, var(--color-fg) 12%, transparent);
  /* Los bordes se desvanecen: sin esto la cinta "empieza" y "termina" en un
     corte duro y se nota que es un truco. */
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}

.wf-marquee-track,
.wf-marquee-set {
  display: flex;
  align-items: center;
  width: max-content;
  margin: 0;
  padding: 0;
  list-style: none;
}

.wf-marquee-track {
  animation: wf-marquee-scroll var(--wf-marquee-dur, 32s) linear infinite;
}

.wf-marquee-rtl {
  animation-direction: reverse;
}

/* El clon no aporta separación propia: es un contenedor sin caja para que las
   dos mitades midan exactamente lo mismo. */
.wf-marquee-clone {
  display: flex;
}

.wf-marquee-item {
  /* La separación va como padding del ítem, NO como gap del track: ver el
     comentario del módulo -- con gap, -50% no cae en el mismo lugar. */
  padding-inline-end: var(--wf-marquee-gap);
  white-space: nowrap;
  font-family: var(--font-heading);
  font-size: clamp(1.05rem, 2.1vw, 1.5rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: color-mix(in srgb, var(--color-fg) 82%, var(--color-bg));
}

@keyframes wf-marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* WCAG 2.2.2: quien lee tiene que poder frenarla, con mouse o con teclado. */
.wf-marquee:hover .wf-marquee-track,
.wf-marquee:focus-within .wf-marquee-track {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .wf-marquee {
    overflow-x: auto;
    mask-image: none;
  }

  .wf-marquee-track {
    animation: none;
  }
}
`.trim();
