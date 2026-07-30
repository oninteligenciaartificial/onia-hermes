"use client";

import * as m from "motion/react-m";
import { PressableCta, easeOutExpo, viewportOnce } from "@/motion";
import { useRubro } from "@/components/rubro-context";
import { APP_URL, waLink } from "@/lib/site";
import { rubroPlanes } from "@/lib/pricing";
import { AgendaForm } from "./agenda-form";
import styles from "./doors.module.css";

/**
 * Seccion g — los dos caminos de compra. Deliberadamente NO simetricos
 * (55/45): la puerta de hablar con nosotros es la principal, la de arrancar
 * solo es la secundaria. Cada panel se "abre" con clip-path al entrar al
 * viewport y el hover PREVISUALIZA lo que hay detras: el mensaje real que va a
 * salir por WhatsApp (con el rubro que el visitante eligio mas arriba) o el
 * cursor recorriendo el tablero.
 */

const openDoor = (delay: number) => ({
  initial: { clipPath: "inset(0% 0% 100% 0%)", opacity: 0 },
  whileInView: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 },
  viewport: viewportOnce,
  transition: { duration: 0.8, ease: easeOutExpo, delay },
});

export function Doors() {
  const { rubro } = useRubro();
  const actual = rubroPlanes(rubro);
  // el mensaje viaja con contexto: del otro lado saben de que rubro se habla
  // sin volver a preguntarlo
  const texto = `Hola, vengo de la web de Onia. Rubro: ${actual.mensaje}. Quiero que me cuenten cómo arranco.`;

  return (
    <section id="empezar" className="section">
      <div className="container">
        <h2 className={`h2 ${styles.title}`}>Dos formas de arrancar. Elegí la tuya.</h2>
        <p className={`lead ${styles.lead}`}>
          Podés hablar con una persona antes de decidir nada, o mirar por tu
          cuenta y hablar recién cuando quieras. Ninguna de las dos te pide
          tarjeta.
        </p>

        <div className={styles.grid}>
          {/* puerta principal: hablar con nosotros */}
          <m.div className={`${styles.door} ${styles.doorMain}`} {...openDoor(0)}>
            <p className={`mono ${styles.doorTag}`}>Puerta 1 · con nosotros</p>
            <h3 className={styles.doorTitle}>Hablá con nosotros</h3>
            <p className={styles.doorBody}>
              Te mostramos Onia andando con tu caso real y hacemos la cuenta con
              tus números: cuántas citas perdés, cuánto es eso al mes. Si te
              cierra, dejamos tu cuenta lista en esa misma llamada.
            </p>
            <div className={styles.doorCta}>
              <PressableCta>
                <a href={waLink(texto)} className="btn btn-wa">
                  <span className="btn-dot" aria-hidden />
                  Escribinos por WhatsApp
                </a>
              </PressableCta>
            </div>
            {/* el mensaje exacto que se va a escribir, a la vista: nada sale
                por sorpresa y el visitante ve que lleva su rubro */}
            <span className={styles.waPreview} aria-hidden>
              {texto}
            </span>
            <p className={styles.doorMicro}>
              Escribe una persona del equipo, no un menú de opciones.
            </p>

            <AgendaForm />
          </m.div>

          {/* puerta secundaria: por tu cuenta */}
          <m.div className={styles.door} {...openDoor(0.12)}>
            <p className={`mono ${styles.doorTag}`}>Puerta 2 · por tu cuenta</p>
            <h3 className={styles.doorTitle}>Empezá solo</h3>
            <p className={styles.doorBody}>
              Tres preguntas y te decimos qué encenderíamos para tu negocio y
              qué plan te calza. Sin registro: no te pedimos nombre, correo ni
              teléfono.
            </p>
            <div className={styles.doorCta}>
              <PressableCta>
                <a href="/empezar" className="btn btn-ghost">
                  Armar mi recomendación
                </a>
              </PressableCta>
            </div>
            <p className={styles.doorMicro}>
              ¿Ya lo tenés claro?{" "}
              <a href={APP_URL} className={styles.doorLink}>
                Entrá a la app y recorrela
              </a>{" "}
              con datos de ejemplo.
            </p>
            {/* preview en hover: mini tablero con cursor que lo recorre */}
            <span className={styles.demoPreview} aria-hidden>
              <span className={styles.demoTile} />
              <span className={styles.demoTile} />
              <span className={styles.demoTile} />
              <span className={styles.demoTile} />
              <span className={styles.demoCursor} />
            </span>
          </m.div>
        </div>
      </div>
    </section>
  );
}
