import type { Metadata } from "next";
import { Entrada, Reveal } from "@/motion";
import {
  CONTENDIENTES,
  EJES,
  HUECO,
  FECHA_CONSULTA,
  TC_NOTA,
  tituloDelCuadro,
  type Estado,
} from "@/lib/proof";
import { Block, Btn, Kicker } from "../ui";
import { CTA_ALTA } from "../alta";
import { EMPEZAR_URL } from "../nav";
import s from "../sitio.module.css";

/**
 * /comparativa — la pantalla que mata la objeción boliviana.
 *
 * Las tres objeciones reales ("el Portal del SIN es gratis", "ya tengo
 * facturador", "el de afuera es mejor") son EXACTAMENTE las tres primeras
 * filas de CONTENDIENTES en lib/proof.ts, con precio publicado, nombre propio
 * y fecha de consulta. Cero cifras a mano: todo sale de la fuente.
 *
 * No es una tabla. Una tabla de cinco columnas desborda a 390px y Bolivia
 * entra por teléfono: es una fila plana por contendiente, y la de Onia cambia
 * de tono en vez de llevar sombra.
 *
 * El ledger de honestidad (TODAVIA_NO) NO se trae acá: dos de sus tres líneas
 * ya viven donde corresponde — la fiscal en /facturacion y en el bloque
 * fiscal de /precios — y la tercera anuncia obra en curso, que
 * en una superficie de venta está prohibida. El veredicto de la fila de Onia
 * dice dónde se emite hoy la factura fiscal (sin estado de trámite desde el
 * 2026-10-01).
 *
 * ⚠️ Y la `description` tardó en enterarse. Hasta el 2026-09-03 cerraba con
 * *"Y lo que Onia todavía no hace."*: prometía en el buscador el ledger que
 * esta página decidió no mostrar, así que era obra a la vista Y era falsa. El
 * cuerpo se arregló y el `<head>` quedó repitiendo la frase vieja — el mismo
 * camino que /terminos. Lo cubre ahora `obra.test.ts`.
 */

export const metadata: Metadata = {
  title: "Onia comparada con los sistemas que se venden en Bolivia",
  description:
    "Qué cobra y qué resuelve cada sistema que se vende en Bolivia: Portal del SIN, facturadores y software dental de la región. Con precio público y fecha de consulta.",
  alternates: { canonical: "/comparativa" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Onia comparada con lo que se vende en Bolivia",
    description:
      "Nombres propios, precios públicos y fecha de consulta. Comprobalo vos mismo.",
    url: "/comparativa",
  },
};

/** Cómo se dice cada estado. Palabras, no símbolos: se leen en voz alta. */
const MARCA: Record<Estado, string> = {
  si: "Sí",
  no: "No",
};

export default function Comparativa() {
  return (
    <>
      <Block surface="paper">
        <Entrada>
          <Kicker>Comparación</Kicker>
          <h1 className={s.display}>
            Comparalo con lo que se vende en <em>Bolivia</em>.
          </h1>
          <p className={s.lead}>
            {HUECO} Todos los precios de abajo son públicos: abrí cualquiera de
            esas webs y comprobalo vos mismo.
          </p>
        </Entrada>
      </Block>

      <Block surface="paperDim" labelledBy="cuadro">
        <Reveal>
          <h2 id="cuadro" className={s.h2}>
            {tituloDelCuadro()}
          </h2>
          <p className={s.note} style={{ marginTop: "1em" }}>
            Los ejes: {EJES.map((e) => e.label).join(" · ")}.
          </p>
        </Reveal>

        <div className={s.cmp}>
          {CONTENDIENTES.map((c) => (
            <Reveal key={c.id}>
              <div className={`${s.cmpRow} ${c.esOnia ? s.cmpOnia : ""}`}>
                <div>
                  <h3 className={s.h3}>{c.quien}</h3>
                  <p className={s.cmpEjemplos}>{c.ejemplos}</p>
                  <p className={s.cmpPrecio}>{c.precio}</p>
                  {c.precioNota && (
                    <p className={s.cmpEjemplos}>{c.precioNota}</p>
                  )}
                </div>
                <div>
                  <ul className={s.ejes}>
                    {EJES.map((eje) => {
                      const estado = c.estados[eje.id];
                      return (
                        <li
                          key={eje.id}
                          className={`${s.eje} ${estado === "no" ? s.ejeOff : ""}`}
                        >
                          <span className={s.ejeMark}>{MARCA[estado]}</span>
                          {eje.label}
                          {/* Nuestra fila dice hasta dónde llega: un «Sí» pelado
                              en la tabla que existe para que nos crean se lo
                              promete también a los rubros que no la tienen. */}
                          {c.esOnia && estado === "si" && eje.alcanceOnia ? (
                            <span className={s.ejeAlcance}>
                              {" "}
                              — {eje.alcanceOnia}
                            </span>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                  <p className={s.cmpVeredicto} style={{ marginTop: "1.1em" }}>
                    {c.veredicto}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className={s.note} style={{ marginTop: "2.4em" }}>
            Precios y capacidades tal como los publica cada proveedor,
            consultados el {FECHA_CONSULTA}. {TC_NOTA}.
          </p>
        </Reveal>
      </Block>

      {/* La factura, que es la mitad de la objeción */}
      <Block surface="green" labelledBy="factura">
        <Reveal>
          <Kicker>La factura</Kicker>
          <p id="factura" className={s.h2} style={{ maxWidth: "24ch" }}>
            El Portal del SIN es gratis y cumple la ley. Eso lo decimos
            nosotros primero.
          </p>
          <p className={s.body} style={{ fontSize: "1.1em", maxWidth: "48em" }}>
            Lo que un sistema resuelve no es la obligación: es no tipear cada
            venta dos veces. Está contado entero, con las resoluciones y las
            fechas, en la página de facturación.
          </p>
          <div className={s.actions}>
            <Btn href="/facturacion" variant="line">
              Ver qué exige el SIN
            </Btn>
          </div>
        </Reveal>
      </Block>

      <Block surface="signal" labelledBy="cierre-cmp">
        <Reveal>
          <h2 id="cierre-cmp" className={s.display} style={{ maxWidth: "18ch" }}>
            Comparalo con tu propio negocio adentro.
          </h2>
          <div className={s.actions}>
            <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
            <Btn href="/precios" variant="line">
              Ver precios
            </Btn>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
