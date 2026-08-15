import { PressableCta, Reveal } from "@/motion";
import { APP_URL, WA_URL_LANDING } from "@/lib/site";
import styles from "./landing.module.css";

/**
 * Garantia — la card sobre tinta que contesta el miedo real de quien no nos
 * conoce ("¿y si no me sirve?") con lo unico que lo cubre: probás antes de
 * pagar, salís cuando querés y los datos te los llevás.
 *
 * Regla al editar: NADA de prueba inventada (clientes, cifras, testimonios,
 * logos). Y tampoco al reves: el estado de la factura fiscal y lo que el
 * sistema todavia no hace no se borran del sitio — viven donde se decide la
 * compra (preguntas frecuentes, precios y /comparativa), dichos como estado.
 */
export function Garantia() {
  return (
    <section className={`${styles.section} ${styles.secTinta} ${styles.onDark}`}>
      <div className={styles.container}>
        <Reveal className={styles.honest}>
          <h2>Probalo 14 días antes de decidir. Sin tarjeta.</h2>
          <ul>
            <li>
              Entrás, elegís tu rubro y usás el sistema completo: 14 días
              gratis, sin poner un peso ni dejar una tarjeta.
            </li>
            <li>
              Sin contrato de permanencia: pagás el ciclo que elijas y dejás de
              renovar cuando quieras, sin penalidad.
            </li>
            <li>
              Tus datos son tuyos: los exportás en CSV cuando quieras, no los
              vendemos y no entrenamos modelos de IA con ellos.
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
