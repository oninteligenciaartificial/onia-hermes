"use client";

import * as m from "motion/react-m";
import { PressableCta, easeOutExpo, viewportOnce } from "@/motion";
import { APP_URL, WA_URL } from "@/lib/site";
import styles from "./doors.module.css";

/**
 * Seccion g — gradiente de confianza: dos puertas deliberadamente NO
 * simetricas (55/45). La puerta WhatsApp es la principal; la demo, la
 * secundaria. Cada panel se "abre" con clip-path al entrar al viewport y
 * el hover PREVISUALIZA literalmente lo que hay detras: la burbuja del
 * chat real o el cursor recorriendo el tablero.
 */

const openDoor = (delay: number) => ({
  initial: { clipPath: "inset(0% 0% 100% 0%)", opacity: 0 },
  whileInView: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 },
  viewport: viewportOnce,
  transition: { duration: 0.8, ease: easeOutExpo, delay },
});

export function Doors() {
  return (
    <section className="section">
      <div className="container">
        <h2 className={`h2 ${styles.title}`}>Entrá como te dé más confianza.</h2>

        <div className={styles.grid}>
          {/* puerta principal: WhatsApp */}
          <m.div className={`${styles.door} ${styles.doorMain}`} {...openDoor(0)}>
            <p className={`mono ${styles.doorTag}`}>Puerta 1 · con nosotros</p>
            <h3 className={styles.doorTitle}>Hablá con nosotros</h3>
            <p className={styles.doorBody}>
              Te mostramos Onia andando con tu caso real, y si te cierra,
              dejamos tu cuenta lista en esa misma llamada — rubro elegido,
              datos cargados, sin tarea para tu casa.
            </p>
            <div className={styles.doorCta}>
              <PressableCta>
                <a href={WA_URL} className="btn btn-wa">
                  <span className="btn-dot" aria-hidden />
                  Hablanos por WhatsApp
                </a>
              </PressableCta>
            </div>
            <p className={styles.doorMicro}>
              Respuesta de una persona, no de un menú.
            </p>
            {/* preview en hover: el mensaje real que va a salir */}
            <span className={styles.waPreview} aria-hidden>
              Hola, quiero conocer Onia
            </span>
          </m.div>

          {/* puerta secundaria: la demo */}
          <m.div className={styles.door} {...openDoor(0.12)}>
            <p className={`mono ${styles.doorTag}`}>Puerta 2 · por tu cuenta</p>
            <h3 className={styles.doorTitle}>Probá solo</h3>
            <p className={styles.doorBody}>
              ¿Preferís tocar antes que hablar? Entrá a la app y recorrela por
              tu cuenta, con datos de ejemplo, sin compromiso y sin que nadie
              te llame.
            </p>
            <div className={styles.doorCta}>
              <a href={APP_URL} className="btn btn-ghost">
                Entrar a la app
              </a>
            </div>
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
