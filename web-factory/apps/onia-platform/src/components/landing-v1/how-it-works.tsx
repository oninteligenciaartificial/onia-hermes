import { Reveal, SplitTextReveal } from "@/motion";
import { PRUEBA, ALCANCE_CON_AGENDA } from "@/lib/pricing";
import { WA_URL_LANDING } from "@/lib/site";
import {
  CUANTOS_RUBROS,
  CUANTOS_RUBROS_CAPITAL,
  RUBROS_EN_PROSA,
  RUBROS_VIVOS,
} from "@/content/rubros";
import { Row, Shot } from "./shot";
import { ModulesDemo } from "./modules-demo";
import styles from "./landing.module.css";

/**
 * Como funciona — 3 pasos en zig-zag, no 3 cards iguales.
 * Cada paso: numeral editorial (fino y grande, sobre su hairline), titulo de
 * 3 palabras, UNA frase y una imagen grande.
 *
 * Los TRES pasos se construyen con markup, ninguno es una foto de la app.
 * El paso 03 ademas se TOCA: los interruptores de modulos son reales
 * (ModulesDemo).
 *
 * EL PASO 01 LLEVABA UNA CAPTURA, y por que ya no — medido el 2026-09-24 en
 * produccion. Era `/capturas/rubros-onia.webp`, servida en `/v1`, y adentro
 * tenia dibujada la banda «MUY PRONTO» y SEIS rubros con Veterinaria, que
 * salio del alta el 13-ago. El parrafo de al lado, el `alt` y `CUANTOS_RUBROS`
 * decian cinco: el texto y los pixeles se contradecian y solo el texto tenia
 * gate. Ningun instrumento de este repo lee un `.webp`, asi que rompia dos
 * reglas de Sergio Urcullo —nada de capturas literales (2026-09-01), la venta
 * nunca exhibe obra (2026-08-20)— en VERDE.
 *
 * Por eso ahora los rubros salen de `RUBROS_VIVOS`: la afirmacion volvio a ser
 * TEXTO, y con eso cae bajo `rubros-en-la-prosa.test.ts`, `obra-literal.test.ts`
 * y el alias `rubros:vivos`, que ya existian. La guarda de la clase entera vive
 * en `app/imagen-sin-obra.test.ts`.
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
            <div
              role="img"
              aria-label={`Alta de Onia: se elige el tipo de negocio entre ${CUANTOS_RUBROS} rubros — ${RUBROS_EN_PROSA}.`}
            >
              <Shot
                title="Crear cuenta · tu rubro"
                tag={`${CUANTOS_RUBROS_CAPITAL} rubros`}
              >
                {RUBROS_VIVOS.map((rubro) => (
                  <Row key={rubro.chip} name={rubro.chip} />
                ))}
              </Shot>
            </div>
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
