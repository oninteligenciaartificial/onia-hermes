import { PressableCta, Reveal } from "@/motion";
import { PRUEBA } from "@/lib/pricing";
import { APP_URL, WA_URL_LANDING } from "@/lib/site";
import styles from "./landing.module.css";

/**
 * Cierre — un solo viewport con proposito unico: la foto a sangre con velo de
 * tinta, el display, las dos salidas y las tres garantias sobre una hairline.
 *
 * La antigua seccion "Garantia" (tinta aparte) vive ACA, condensada: las tres
 * promesas contestan el miedo real ("¿y si no me sirve?") justo al lado del
 * boton que pide el salto. Nada se borro — se movio a donde se decide.
 *
 * Regla al editar: NADA de prueba inventada (clientes, cifras, testimonios,
 * logos). El estado fiscal y lo que falta viven en precios, la comparativa y
 * las preguntas frecuentes, dichos como estado.
 */
export function Closing() {
  return (
    <section className={`${styles.closeSec} ${styles.onDark}`}>
      <div className={styles.closeBg} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/fotos/duena-telefono.webp"
          srcSet="/fotos/duena-telefono-480.webp 480w, /fotos/duena-telefono-960.webp 960w, /fotos/duena-telefono.webp 1344w"
          sizes="100vw"
          alt=""
          width={1344}
          height={768}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className={`${styles.container} ${styles.closeIn}`}>
        <Reveal>
          <span className={styles.kicker}>Empezá hoy</span>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className={styles.display}>
            Probá Onia Platform <em>{PRUEBA.dias} días gratis</em>.
          </h2>
        </Reveal>
        <Reveal delay={0.12} className={styles.closeCta}>
          <PressableCta>
            <a
              className={`${styles.btn} ${styles.btnPrimary}`}
              href={`${APP_URL}/register`}
            >
              Probar gratis {PRUEBA.dias} días
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

        <Reveal delay={0.18} className={styles.closeGarantias} as="div">
          <div>
            <h3>Sin tarjeta</h3>
            <p>
              Entrás, elegís tu rubro y usás el sistema completo {PRUEBA.dias} días, sin
              poner un peso ni dejar una tarjeta.
            </p>
          </div>
          <div>
            <h3>Sin permanencia</h3>
            <p>
              Pagás el ciclo que elijas y dejás de renovar cuando quieras, sin
              penalidad.
            </p>
          </div>
          <div>
            <h3>Tus datos son tuyos</h3>
            <p>
              Los exportás en CSV cuando quieras. No los vendemos y no
              entrenamos modelos de IA con ellos.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
