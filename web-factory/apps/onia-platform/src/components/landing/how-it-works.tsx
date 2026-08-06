import { Reveal } from "@/motion";
import { WA_URL_LANDING } from "@/lib/site";
import { Modules, Row, Shot, ShotImage } from "./shot";
import styles from "./landing.module.css";

const MODULOS_PASO3 = [
  { label: "Gestión", on: true },
  { label: "Agentes IA", on: true },
  { label: "WhatsApp", on: true },
  { label: "Página web", on: false },
  { label: "Reserva online", on: false },
  { label: "Automatizaciones", on: false },
] as const;

/**
 * Como funciona — 3 pasos en zig-zag, no 3 cards iguales.
 * Cada paso: numero grande, titulo de 3 palabras, UNA frase (<=11 palabras)
 * y una imagen grande. 44 palabras en toda la seccion.
 *
 * El paso 01 lleva la CAPTURA REAL del selector de rubro de app.onia.com.bo:
 * es la pantalla que prueba el multirubro, y es publica (no hace falta cuenta).
 */
export function HowItWorks() {
  return (
    <section className={styles.section} id="como">
      <div className={styles.container}>
        <Reveal>
          <h2 className={styles.sectionTitle}>
            Tu sistema de gestión, andando en un día.
          </h2>
        </Reveal>
      </div>

      <div className={`${styles.container} ${styles.steps}`}>
        <article className={styles.step}>
          <Reveal>
            <span className={styles.stepNum} aria-hidden>
              01
            </span>
            <h3>Elegí tu rubro.</h3>
            <p>
              Dental, comercio, importadora, estética, veterinaria o servicios
              profesionales. Onia se arma para el tuyo.
            </p>
          </Reveal>
          <Reveal delay={0.1} className={styles.stepVisual}>
            <Shot title="app.onia.com.bo · crear cuenta" bodyless>
              <ShotImage
                src="/capturas/rubros-onia.webp"
                alt="Pantalla real de Onia al crear una cuenta: elegís el tipo de negocio entre seis rubros disponibles — clínica dental, comercio o tienda, importadora, estética y spa, veterinaria y servicios profesionales; gastronomía, construcción, educación, turismo y ganadería figuran como muy pronto."
                width={1200}
                height={824}
              />
            </Shot>
          </Reveal>
        </article>

        <article className={styles.step}>
          <Reveal>
            <span className={styles.stepNum} aria-hidden>
              02
            </span>
            <h3>Tu cuenta queda lista.</h3>
            <p>Sin instalación ni proyecto de meses. Agenda, clientes y caja ya adentro.</p>
          </Reveal>
          <Reveal delay={0.1} className={styles.stepVisual}>
            <div
              role="img"
              aria-label="Agenda semanal de una clínica en Onia Platform: cinco citas del martes con hora, tratamiento, paciente y duración."
            >
              <Shot title="Agenda · martes 4" tag="7 citas">
                <Row time="08:30" name="Limpieza · C. Vaca" dur="30 min" state="on" />
                <Row time="09:15" name="Control · M. Áñez" dur="20 min" />
                <Row time="10:00" name="Endodoncia · P. Suárez" dur="60 min" />
                <Row time="11:15" name="Libre" state="free" />
                <Row time="12:00" name="Ortodoncia · J. Rojas" dur="45 min" />
              </Shot>
            </div>
          </Reveal>
        </article>

        <article className={styles.step}>
          <Reveal>
            <span className={styles.stepNum} aria-hidden>
              03
            </span>
            <h3>Encendé módulos.</h3>
            <p>Chatbot, web, agentes. Un interruptor, no un sistema nuevo.</p>
          </Reveal>
          <Reveal delay={0.1} className={styles.stepVisual}>
            <div
              role="img"
              aria-label="Pantalla de módulos de la cuenta: interruptores para gestión, agentes con IA, WhatsApp, página web, reserva online y automatizaciones."
            >
              <Shot title="Módulos de tu cuenta">
                <Modules items={MODULOS_PASO3} />
              </Shot>
            </div>
          </Reveal>
        </article>
      </div>

      <div className={styles.container}>
        <Reveal className={`${styles.photo} ${styles.photoWide}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fotos/ferreteria.webp"
            alt="Dueño de una ferretería atendiendo el mostrador de su negocio con una tablet en la mano."
            width={1280}
            height={832}
            loading="lazy"
            decoding="async"
          />
        </Reveal>

        <Reveal className={styles.rail}>
          <p>
            Te lo dejamos andando nosotros: cargamos tus datos y capacitamos a tu
            equipo.
          </p>
          <a className={`${styles.btn} ${styles.btnPrimary}`} href="#precios">
            Probar gratis 14 días
          </a>
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
