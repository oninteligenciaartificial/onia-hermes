import { Reveal } from "@/motion";
import { Modules, Row, Shot } from "./shot";
import { ParallaxSoft } from "./parallax";
import styles from "./landing.module.css";

const CHIPS = ["Sin tarjeta", "Migramos tus datos", "Desde Bs 320/mes"] as const;

const MODULOS_HERO = [
  { label: "Gestión", on: true },
  { label: "Agentes IA", on: true },
  { label: "WhatsApp", on: false },
  { label: "Página web", on: false },
] as const;

/**
 * Hero — 35 palabras visibles, UN display, UN marco de producto.
 *
 * El marco sube sobre el bloque de copy, sangra fuera del margen derecho y
 * arrastra un halo verde: el verde es el ENCENDIDO, nunca decoracion.
 */
export function Hero() {
  return (
    <section className={styles.hero} id="inicio">
      <div className={styles.container}>
        <Reveal>
          <span className={styles.kicker}>Onia Platform · hecho en Bolivia</span>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className={`${styles.display} ${styles.heroTitle}`}>
            El sistema de gestión <em>con IA</em> para tu negocio en Bolivia.
          </h1>
        </Reveal>
      </div>

      <div className={`${styles.container} ${styles.heroBody}`}>
        <div>
          <Reveal delay={0.12}>
            <p className={styles.lead}>
              Agenda, clientes, cobros y agentes que trabajan 24/7 con tu
              aprobación. Una sola cuenta, un solo precio.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className={styles.heroCta}>
              <a className={`${styles.btn} ${styles.btnPrimary}`} href="#precios">
                Probar gratis 14 días
              </a>
              <a className={`${styles.btn} ${styles.btnGhost}`} href="#como">
                Ver cómo funciona
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <ul className={styles.heroChips}>
              {CHIPS.map((chip) => (
                <li key={chip} className={styles.chip}>
                  {chip}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <ParallaxSoft className={styles.heroShot}>
          {/* Maqueta, no captura: el panel de una cuenta configurada no se
              puede capturar sin una cuenta demo con datos. Se reemplaza por
              captura real en cuanto exista. */}
          <div
            role="img"
            aria-label="Panel de una cuenta de Onia Platform configurada para una clínica dental: la agenda del día, un hueco que el agente ya propuso llenar, y los módulos de gestión y agentes con IA encendidos."
          >
            <Shot title="Tu cuenta · hoy" tag="Rubro: Dental">
              <Row time="09:00" name="Control · M. Áñez" dur="30 min" state="on" />
              <Row time="10:30" name="Ortodoncia · J. Rojas" dur="45 min" />
              <Row
                time="11:15"
                name="Hueco — el agente ya propuso a quién mover"
                state="free"
              />
              <Modules items={MODULOS_HERO} />
            </Shot>
          </div>

          <div className={`${styles.photo} ${styles.photoHero}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/fotos/dentista.webp"
              alt="Odontóloga atendiendo en su consultorio, junto al sillón dental."
              width={896}
              height={1152}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </ParallaxSoft>
      </div>
    </section>
  );
}
