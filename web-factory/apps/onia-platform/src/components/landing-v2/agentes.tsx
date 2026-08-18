import { Reveal } from "@/motion";
import { Pantalla } from "./pantalla";
import styles from "./v2.module.css";

/**
 * 4. AGENTES — ANCLA OSCURA. Un solo mensaje: trabajan de noche, no deciden solos.
 *
 * Leyes aplicadas:
 *  · "NO se porta: fondo negro total" → el negro es ANCLA de sección, no base.
 *    La página es clara (dirección de Onia) y ésta es la primera de las dos
 *    únicas secciones oscuras.
 *  · 6 → acá sí valen los 15 % literales de Fanvue
 *    (`rgba(239,238,236,0.15)`), porque el fondo volvió a ser oscuro: las
 *    celdas se separan por hairlines de transparencia, sin una sola tarjeta.
 *  · 1-3 → display gigante en blanco, peso 500, apretado.
 *
 * El contenido sale de la pantalla real de Agentes del producto (la captura de
 * al lado): Recall y Cobrador, corriendo cada 24 h, que PROPONEN y nunca envían
 * solos. Nada de esto es promesa: está en la captura.
 */

const CELDAS = [
  [
    "Recall",
    "Detecta clientes que no vuelven hace meses y no tienen próxima cita, y redacta el mensaje para traerlos. Corre cada 24 horas.",
  ],
  [
    "Cobrador",
    "Detecta facturas emitidas con saldo vencido y redacta el recordatorio de pago. No cobra: prepara el reclamo.",
  ],
  [
    "Tu aprobación",
    "Cada propuesta espera en Pendientes hasta que alguien la aprueba. Ninguna sale sola, y podés descartarla sin explicar nada.",
  ],
] as const;

export function AgentesV2() {
  return (
    <section
      className={`${styles.section} ${styles.ancla}`}
      aria-labelledby="v2-agentes"
    >
      <div className={styles.container}>
        <Reveal>
          <p className={styles.kicker}>Automatización</p>
          <h2 id="v2-agentes" className={`${styles.display} ${styles.heroTitulo}`}>
            Trabajan de noche. No <em>deciden</em> solos.
          </h2>
        </Reveal>

        <div className={styles.anclaGrid}>
          <Reveal delay={0.06}>
            <p className={styles.lead}>
              Los agentes revisan tus datos mientras el negocio está cerrado y
              dejan un borrador esperando. A la mañana ves qué proponen, aprobás
              lo que te sirve y se manda. Eso es todo el trato: la máquina hace
              el trabajo aburrido, la decisión sigue siendo tuya.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <Pantalla
              src="/v2/panel-agentes.webp"
              alt="Pantalla real de Agentes en Onia: Recall y Cobrador activos, corriendo cada 24 horas, con el texto que aclara que solo proponen y que cada mensaje se aprueba en Pendientes."
              pie="Captura de producción · pantalla Agentes"
              ancho={1440}
              alto={900}
            />
          </Reveal>
        </div>

        <Reveal delay={0.06}>
          <div className={styles.celdas}>
            {CELDAS.map(([titulo, texto]) => (
              <div key={titulo} className={styles.celda}>
                <h3>{titulo}</h3>
                <p>{texto}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
