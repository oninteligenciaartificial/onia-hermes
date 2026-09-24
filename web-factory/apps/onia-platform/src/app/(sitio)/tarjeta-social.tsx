import { ImageResponse } from "next/og";

import { bs, plan, PRUEBA } from "@/lib/pricing";

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
 * referenciales"). Cero <img>, cero sombra, y el verde va en FORMAS, nunca en
 * texto.
 *
 * ⚠️ **Qué dice, y por qué cambió el 2026-09-05.** Hasta hoy esta tarjeta era
 * el hero ANTERIOR entero: "Cerrás vos / El negocio no", "Un negocio abre 9
 * horas. Onia atiende las otras 15" y el día partido en 9/15. Esa escena es la
 * del ASISTENTE —add-on de `lib/pricing.ts`, Bs 390—, y el 2026-09-04 se la
 * echó de la portada justamente por eso (`hero.test.ts`, Sergio 2026-09-03:
 * "el sistema no ofrece directamente el bot, ofrece solo el sistema").
 *
 * El barrido de ese día alcanzó el hero, el `<title>`, la `description` y los
 * `og:*` — y paró ahí. La tarjeta quedó contradiciendo a su propio `<head>`:
 * el título ofrecía el sistema y el dibujo, que pesa más y se lee primero,
 * seguía vendiendo al bot. Es la superficie que se ve ANTES de que el sitio
 * cargue y la ÚNICA que ve el que nunca abre el link — el canal por el que
 * Sergio manda onia.com.bo a un lead. Ninguna captura del sitio la mira.
 *
 * Ahora dibuja lo que el hero promete: las piezas del negocio, hoy
 * sueltas, dentro de una sola pantalla. El precio se INTERPOLA de
 * `lib/pricing.ts` — una cifra a mano acá se comparte por WhatsApp durante
 * meses sin que ninguna pantalla la muestre. Lo vigila `hero.test.ts`.
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
  "Onia — Todo el negocio, en una pantalla. Clientes, caja, cobros y contabilidad dibujados como cuatro piezas sueltas que entran en un solo sistema.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Los mismos valores de globals.css. Satori no lee var(--…). */
const PAPEL = "#F9FBFA";
const TINTA = "#141A17";
const TINTA_SUAVE = "#424A46";
const SENAL = "#00d26a";
const LINEA = "#D4D9D6";

/**
 * Las piezas del negocio, en el mismo orden y con las mismas palabras que el
 * hero y la `description`: si acá dijeran otra cosa, la tarjeta prometería un
 * sistema distinto del que abre al hacer clic.
 *
 * Sólo piezas que tienen los CINCO rubros del alta. «Inventario» salió el
 * 2026-09-24: servicios profesionales no tiene esa pantalla
 * (`ALCANCE_POR_INVENTARIO` en lib/pricing.ts), y una pieza suelta en un
 * dibujo no tiene dónde decir su alcance.
 */
const PIEZAS = ["Clientes", "Caja", "Cobros", "Contabilidad"];

/**
 * La bajada se arma como UN string y no se interpola dentro del JSX.
 *
 * No es estilo: Satori exige `display: flex` explícito en todo div con más de
 * un hijo, y `Desde Bs {…} al mes. {…} días` son cinco nodos de texto para él.
 * Interpolado en el JSX rompe el `next build` entero —las cinco rutas con
 * tarjeta fallan al prerenderizar— y el error no dice cuál es el div.
 */
const BAJADA = `Desde Bs ${bs(plan("basico").mensual)} al mes. ${PRUEBA.dias} días gratis, sin tarjeta.`;

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
            Todo el negocio,
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
            en una pantalla.
          </div>
          <div style={{ fontSize: 30, color: TINTA_SUAVE, marginTop: 22, lineHeight: 1.35 }}>
            {BAJADA}
          </div>
        </div>

        {/* Las piezas, dentro de UN marco: eso es "en una pantalla".
            El marco se escapa por el borde derecho igual que se escapaba el
            verde del día — el sistema sigue, no se acaba en la tarjeta. */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "18px 0 18px 18px",
              border: `2px solid ${LINEA}`,
              borderRadius: 14,
              backgroundColor: "#FFFFFF",
            }}
          >
            {PIEZAS.map((pieza, i) => (
              <div
                key={pieza}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 22px",
                  borderRadius: 8,
                  backgroundColor: PAPEL,
                  fontSize: 26,
                  color: TINTA,
                  fontWeight: 600,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    backgroundColor: i === 0 ? SENAL : LINEA,
                  }}
                />
                {pieza}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingRight: 72 }}>
            <div style={{ fontSize: 22, color: TINTA_SUAVE }}>
              Un solo sistema, ya armado para tu rubro
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
