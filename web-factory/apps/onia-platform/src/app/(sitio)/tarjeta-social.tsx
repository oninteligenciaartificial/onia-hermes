import { ImageResponse } from "next/og";

/**
 * La tarjeta social del sitio de venta — DIBUJADA, no fotografiada.
 *
 * Hasta el 2026-09-02 el `og:image` de la home era `/og/onia-rubros.jpg`: una
 * captura del selector de rubro con CINCO defectos a la vez —"MUY PRONTO"
 * impreso adentro (la venta nunca exhibe obra), la fila de abajo cortada a
 * mitad de tarjeta por el recorte de 630px, sombras (el lenguaje aprobado dice
 * cero), el texto sin tildes ("Que tipo de negocio tenes?") y un `alt` que lo
 * confesaba: "Pantalla real de Onia". Era lo PRIMERO que veía un lead cuando le
 * pasaban el link por WhatsApp, antes de que cargara la página: el que nunca
 * abría el sitio igual leía "MUY PRONTO".
 *
 * Se dibuja con el mismo lenguaje que el resto del sitio (Sergio, 2026-09-01:
 * "no coloques capturas literales del sistema, se ve mal, coloca cosas
 * referenciales") y con la MISMA pieza que él aprobó ese día: el hero del
 * resultado. El día del negocio empieza a las 09:00 —como lo piensa el dueño,
 * no como lo piensa un reloj—, nueve horas de tinta son las que atiende él y
 * quince de verde señal las que atiende Onia; el verde se escapa por el borde
 * derecho porque esas horas no terminan. Cero <img>, cero sombra, y el verde va
 * en FORMAS, nunca en texto.
 *
 * ⚠️ **Por qué el dibujo vive acá y no en `opengraph-image.tsx`.** Ese archivo
 * decía que, por vivir en el segmento `(sitio)`, "la heredan sus DOCE rutas".
 * Es FALSO, medido el 2026-09-02 sobre el build: `opengraph-image` de Next
 * aplica SÓLO al `page.tsx` de su propio segmento, no a los anidados. La home
 * servía la tarjeta y las otras once —`/empezar`, `/precios`, `/chatbot`,
 * `/rubros`, `/contacto`, `/comparativa`…— salían con `og:title` y `og:description`
 * pero SIN una sola imagen. O sea: el defecto que ese comentario daba por
 * resuelto seguía vivo en once de las doce rutas, y entre ellas la que más
 * duele — `/empezar`, que es el link que se le pasa a un lead para que se
 * registre. Se llegó a él porque la home lo tiene y `/empezar` no, con las dos
 * declarando `openGraph` igual: la diferencia no era el override, era el
 * segmento.
 *
 * Ahora el dibujo es UNO y vive en este módulo; cada ruta tiene su
 * `opengraph-image.tsx` de tres líneas que lo llama. Ruta nueva en `(sitio)` =
 * copiar ese archivo, o sale sin tarjeta. Lo vigila `forma.test.ts`.
 *
 * ⚠️ Se renderiza con Satori, que NO es un navegador: sólo flexbox, sin
 * variables CSS y sin CSS Modules. Por eso los tokens de marca están acá como
 * hex literales — son los mismos de globals.css y no una paleta nueva.
 */

export const alt =
  "Onia — Cerrás vos, el negocio no. El día de un negocio dibujado: nueve horas que atiende el dueño y quince que atiende Onia.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Los mismos valores de globals.css. Satori no lee var(--…). */
const PAPEL = "#F9FBFA";
const TINTA = "#141A17";
const TINTA_SUAVE = "#424A46";
const SENAL = "#00d26a";
const LINEA = "#D4D9D6";

/** El día: 24 horas desde las 09:00. Las primeras nueve las atiende el dueño. */
const HORAS_ABIERTO = 9;
const HORAS_DIA = 24;

export function dibujarTarjeta(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: PAPEL,
          padding: "64px 0 64px 72px",
        }}
      >
        {/* marca — el punto es una FORMA verde, no una letra verde */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
          <div style={{ fontSize: 44, fontWeight: 700, color: TINTA, letterSpacing: "-0.02em" }}>
            Onia
          </div>
          <div style={{ width: 16, height: 16, backgroundColor: SENAL, marginBottom: 8 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", paddingRight: 72 }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              color: TINTA,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
            }}
          >
            Cerrás vos.
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              color: TINTA,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
            }}
          >
            El negocio no.
          </div>
          <div style={{ fontSize: 30, color: TINTA_SUAVE, marginTop: 22, lineHeight: 1.35 }}>
            Un negocio abre 9 horas. Onia atiende las otras 15.
          </div>
        </div>

        {/* el día, dibujado. El verde sale por el borde derecho: no termina. */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 64 }}>
            {Array.from({ length: HORAS_DIA }, (_, i) => {
              const abierto = i < HORAS_ABIERTO;
              return (
                <div
                  key={i}
                  style={{
                    width: 42,
                    height: abierto ? 30 : 64,
                    backgroundColor: abierto ? TINTA : SENAL,
                    borderRadius: 3,
                  }}
                />
              );
            })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingRight: 72 }}>
            <div style={{ fontSize: 22, color: TINTA_SUAVE }}>09:00 — 18:00 · atendés vos</div>
            <div style={{ width: 1, height: 22, backgroundColor: LINEA }} />
            <div style={{ fontSize: 22, color: TINTA, fontWeight: 600 }}>
              18:00 — 09:00 · atiende Onia
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
