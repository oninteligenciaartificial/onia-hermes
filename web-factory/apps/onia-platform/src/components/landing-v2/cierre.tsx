import { Reveal, BleedWordmark } from "@/motion";
import { PRUEBA } from "@/lib/pricing";
import { WA_URL_LANDING } from "@/lib/site";
import styles from "./v2.module.css";

/**
 * 8. CIERRE — un solo mensaje: empezá hoy, sin tarjeta.
 *
 * Leyes aplicadas:
 *  · 1-3 → el último display, el más grande de la página, sobre papel: cierra
 *    con el mismo gesto con el que abrió.
 *  · 7 → aire generoso antes del remate; el wordmark cortado por abajo es el
 *    remate editorial de la casa (una sola vez por página, siempre al final).
 */
export function CierreV2() {
  return (
    <>
      <section
        className={`${styles.section} ${styles.cierre}`}
        aria-labelledby="v2-cierre"
      >
        <div className={styles.container}>
          <Reveal>
            <h2 id="v2-cierre" className={`${styles.display} ${styles.heroTitulo}`}>
              Probalo <em>hoy</em>. Sin tarjeta.
            </h2>
            <p className={styles.lead}>
              {PRUEBA.dias} días con el plan {PRUEBA.planQueCorre} completo. Si
              no te sirve, no hacés nada: la cuenta queda en solo lectura y tus
              datos se exportan cuando quieras.
            </p>
            <div className={styles.acciones}>
              <a className={styles.btn} href="/prueba-gratis">
                Crear mi cuenta
              </a>
              <a
                className={`${styles.btn} ${styles.btnGhost}`}
                href={WA_URL_LANDING}
              >
                Escribirnos por WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
      <div className={styles.wordmarkStrip}>
        <BleedWordmark className={styles.wordmark} />
      </div>
    </>
  );
}
