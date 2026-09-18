import { Reveal, SplitTextReveal } from "@/motion";
import { PRUEBA, ALCANCE_CON_AGENDA } from "@/lib/pricing";
import { WA_URL_LANDING } from "@/lib/site";
import { CUANTOS_RUBROS } from "@/content/rubros";
import { Row, Shot, ShotImage } from "./shot";
import { ModulesDemo } from "./modules-demo";
import styles from "./landing.module.css";

/**
 * Como funciona — 3 pasos en zig-zag, no 3 cards iguales.
 * Cada paso: numeral editorial (fino y grande, sobre su hairline), titulo de
 * 3 palabras, UNA frase y una imagen grande.
 *
 * El paso 01 lleva la CAPTURA REAL del selector de rubro de app.onia.com.bo:
 * es la pantalla que prueba el multirubro, y es publica (no hace falta cuenta).
 * El paso 03 se TOCA: los interruptores de modulos son reales (ModulesDemo).
 */
export function HowItWorks() {
  return (
    <section className={styles.section} id="como">
      <div className={styles.container}>
        <SplitTextReveal
          as="h2"
          className={styles.sectionTitle}
          text="Tu sistema de gestión, andando en un día."
        />
      </div>

      <div className={`${styles.container} ${styles.steps}`}>
        <article className={styles.step}>
          <Reveal>
            <span className={styles.stepNum} aria-hidden>
              01
            </span>
            <h3>Elegí tu rubro.</h3>
            <p>
              Dental, comercio, importadora, estética o servicios
              profesionales. Onia se arma para el tuyo.
            </p>
          </Reveal>
          <Reveal delay={0.1} className={styles.stepVisual}>
            <Shot title="app.onia.com.bo · crear cuenta" bodyless>
              <ShotImage
                src="/capturas/rubros-onia.webp"
                alt={`Pantalla real de Onia al crear una cuenta: elegís el tipo de negocio entre ${CUANTOS_RUBROS} rubros disponibles — clínica dental, comercio o tienda, importadora, estética y spa, y servicios profesionales.`}
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
            <p>
              Sin instalación ni proyecto de meses. Clientes, caja y cobros ya
              adentro, y agenda {ALCANCE_CON_AGENDA}.
            </p>
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
            {/* interactivo de verdad: cada interruptor es un switch accesible */}
            <Shot title="Módulos de tu cuenta" tag="Probalos">
              <ModulesDemo />
            </Shot>
          </Reveal>
        </article>
      </div>

      <div className={styles.container}>
        <Reveal className={`${styles.photo} ${styles.photoWide}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fotos/ferreteria.webp"
            srcSet="/fotos/ferreteria-480.webp 480w, /fotos/ferreteria-960.webp 960w, /fotos/ferreteria.webp 1280w"
            sizes="(min-width: 1280px) 1180px, 94vw"
            alt="Dueño de una ferretería atendiendo el mostrador de su negocio con una tablet en la mano."
            width={1280}
            height={832}
            loading="lazy"
            decoding="async"
          />
        </Reveal>

        <Reveal className={styles.rail}>
          {/*
            Decía «Te lo dejamos andando nosotros: cargamos tus datos y
            capacitamos a tu equipo» — una implementación entera (migración más
            capacitación) prometida a cada prueba gratis, en la misma página que
            aclara que no cobramos implementación. No hay quién la haga: la vende
            y la opera Sergio Urcullo solo. Va lo que el producto sí entrega.
          */}
          <p>
            Entra andando: llega configurado para tu rubro y tus datos suben por
            CSV con asistente de columnas.
          </p>
          <a className={`${styles.btn} ${styles.btnPrimary}`} href="#precios">
            Probar gratis {PRUEBA.dias} días
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
