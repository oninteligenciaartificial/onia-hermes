import { Reveal } from "@/motion";
import { PRUEBA } from "@/lib/pricing";
import { Pantalla } from "./pantalla";
import styles from "./v2.module.css";

/**
 * 1. HERO — un solo mensaje: nada se te escapa.
 *
 * Leyes aplicadas (fanvue-mecanica-medida.md):
 *  · 1-3 → el display va a 8,5rem con lh 0,80 y peso 500 (`.display`).
 *  · 4   → el lead al 75 % de opacidad, para que el titular mande.
 *  · 5   → titular a 14ch y lead a 46ch aunque la sección mida 1240 px.
 *  · §7  → una sola entrada `opacity+transform` con <Reveal>; cero parallax.
 */
export function HeroV2() {
  return (
    <section className={`${styles.section} ${styles.hero}`}>
      <div className={styles.container}>
        <Reveal>
          <p className={styles.kicker}>Onia · Bolivia</p>
          <h1 className={`${styles.display} ${styles.heroTitulo}`}>
            Nada se te <em>escapa</em>.
          </h1>
        </Reveal>

        <Reveal delay={0.06}>
          <div className={styles.heroBajo}>
            <div>
              <p className={styles.lead}>
                Agenda, clientes, cobros y contabilidad en un solo lugar. De
                noche, los agentes revisan tus datos y te dejan propuestas
                listas: a quién llamar, a quién cobrarle. Vos aprobás; el
                sistema hace.
              </p>
              <div className={styles.acciones}>
                <a className={styles.btn} href="/prueba-gratis">
                  Probar {PRUEBA.dias} días gratis
                </a>
                <a className={`${styles.btn} ${styles.btnGhost}`} href="/precios">
                  Ver precios
                </a>
              </div>
            </div>
            <ul className={styles.heroChips}>
              <li>Sin tarjeta</li>
              <li>Sin implementación</li>
              <li>Tus datos se exportan en CSV</li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.12} className={styles.heroShot}>
          <Pantalla
            src="/v2/editor-chatbot.webp"
            srcMovil="/v2/editor-chatbot-movil.webp"
            alt="Pantalla del sistema: el editor del chatbot de Onia, con el formulario de identidad y horario a la izquierda y el probador a la derecha, donde el bot ya contestó el horario de atención."
            pie="Captura de producción · Configuración → Chatbot, con el probador contestando"
            ancho={1440}
            alto={800}
          />
        </Reveal>
      </div>
    </section>
  );
}
