import { PressableCta, Reveal } from "@/motion";
import { APP_URL, WA_URL_LANDING } from "@/lib/site";
import styles from "./landing.module.css";

/**
 * Honestidad — era una seccion entera con la tabla de 4 competidores; ahora es
 * UNA card de tres lineas sobre tinta. La tabla vive en /comparativa: es el
 * bloque mas denso del sitio y solo lo lee quien ya esta comparando.
 *
 * Lo que NO se toca: cero clientes y la factura en tramite se dicen primero,
 * antes de comprar. Es el diferencial, no un descargo.
 */
export function Honesty() {
  return (
    <section className={`${styles.section} ${styles.secTinta} ${styles.onDark}`}>
      <div className={styles.container}>
        <Reveal className={styles.honest}>
          <h2>Somos nuevos en el mercado boliviano. Te lo decimos primero.</h2>
          <ul>
            <li>Cero clientes pagando todavía: serías de los primeros.</li>
            <li>Nuestra factura fiscal está en trámite ante el SIN.</li>
            <li>
              Por eso probás primero y pagás después: 14 días gratis, sin
              tarjeta y sin contrato de permanencia.
            </li>
            <li>
              <a href="/comparativa">Ver la comparación completa →</a>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/** Cierre — una foto ancha, un display y las dos salidas. Nada mas. */
export function Closing() {
  return (
    <section className={`${styles.section} ${styles.sectionAir}`}>
      <div className={styles.container}>
        <Reveal className={`${styles.photo} ${styles.photoClose}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fotos/duena-telefono.webp"
            alt="Dueña de un negocio revisando en su teléfono las citas confirmadas del día."
            width={1344}
            height={768}
            loading="lazy"
            decoding="async"
          />
        </Reveal>
      </div>

      <div className={`${styles.container} ${styles.close}`}>
        <Reveal>
          <h2 className={styles.display}>
            Probá Onia Platform <em>14 días gratis</em>.
          </h2>
        </Reveal>
        <Reveal delay={0.08} className={styles.closeCta}>
          <PressableCta>
            <a
              className={`${styles.btn} ${styles.btnPrimary}`}
              href={`${APP_URL}/register`}
            >
              Probar gratis 14 días
            </a>
          </PressableCta>
          <a
            className={`${styles.btn} ${styles.btnGhost}`}
            href={WA_URL_LANDING}
            target="_blank"
            rel="noopener noreferrer"
          >
            Hablemos por WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
}
