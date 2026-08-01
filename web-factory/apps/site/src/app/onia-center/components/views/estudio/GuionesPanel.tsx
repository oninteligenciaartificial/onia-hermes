/**
 * Guiones y estructura: como se crea una pieza que funciona.
 *
 * Pedido de Sergio 2026-08-01: el Estudio tiene que servir para CREAR — aca se
 * arman los guiones, la estructura del contenido, y se aprende que hace bueno a
 * un contenido. Todo lo de abajo sale de lo ya decidido y medido en el repo
 * (vocabulario HyperFrames, ritmo observado en reels que funcionan, reglas de
 * la serie); no es teoria de internet.
 */

const ESTRUCTURA = [
  { paso: "1 · Hook (0-2 s)", regla: "Una frase que nombra el DOLOR, no el producto. Texto grande en pantalla desde el frame 1." },
  { paso: "2 · Problema (2-8 s)", regla: "El caso concreto: la silla vacia, la factura tipeada a mano, el paciente que no volvio." },
  { paso: "3 · Giro (8-25 s)", regla: "Como se ve resuelto (pantalla real del producto o mockup por codigo). Sin listar features: UNA sola." },
  { paso: "4 · CTA (ultimos 3 s)", regla: "Una sola accion. 'Comenta AGENTE' o el link con ?src= de la pieza. Nunca dos CTAs." },
];

const REGLAS_BUEN_CONTENIDO = [
  "Ritmo: un elemento nuevo en pantalla cada 1.2-1.8 s (medido en reels que funcionan). Un apoyo cada 16 s se siente muerto.",
  "El elemento mas frecuente es TEXTO CINETICO, no ilustraciones: palabras que aterrizan, flechas que se dibujan, listas que caen.",
  "Vocabulario propio (HyperFrames, gratis): Keyword · Trazo · Tag · Lista · Escena · Stat · Scoreboard. Higgsfield solo para el hook imposible de grabar, con OK.",
  "Identidad de la serie: acento verde 0.45, tipografia Archivo, subtitulos karaoke. El crudo del iPhone es HDR: corregir color antes de editar.",
  "Guion primero, SIEMPRE por escrito y aprobado antes de producir. Las 10 objeciones del kit ya son 10 guiones listos.",
  "Toda pieza sale con su link onia.com.bo/?src=nombre-pieza. Pieza sin ?src= no existe para la atribucion.",
  "Honestidad: nunca 'el SIAT es obligatorio' (el Portal del SIN es gratis). El pitch es 'no tengas que tipear'.",
];

export function GuionesPanel() {
  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-[var(--panel-shadow-sm)]">
      <h2 className="text-sm font-semibold text-foreground">Guiones y estructura</h2>
      <p className="mt-1 text-[12.5px] text-muted-foreground">
        Como se arma una pieza que trae reuniones, no vistas. El guion se escribe y aprueba aca
        ANTES de producir.
      </p>

      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Estructura de una pieza (15-45 s)
          </h3>
          <ul className="mt-1.5 space-y-1.5">
            {ESTRUCTURA.map((item) => (
              <li key={item.paso} className="rounded-md border border-border bg-background px-3 py-2 text-[12.5px]">
                <span className="font-semibold text-foreground">{item.paso}</span>
                <span className="ml-1.5 text-muted-foreground">{item.regla}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Que hace bueno a un contenido (medido, no teoria)
          </h3>
          <ul className="mt-1.5 space-y-1 text-[12.5px] text-muted-foreground">
            {REGLAS_BUEN_CONTENIDO.map((regla) => (
              <li key={regla} className="flex gap-1.5">
                <span className="text-foreground">•</span>
                <span>{regla}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
