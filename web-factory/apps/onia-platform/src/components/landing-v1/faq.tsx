import { SplitTextReveal, StaggerGrid, StaggerItem } from "@/motion";
import { WA_URL_LANDING } from "@/lib/site";
import { precioStack } from "@/content/chatbot-precios";
import styles from "./landing.module.css";

/**
 * FAQ de la home — las objeciones reales antes del cierre, robado del patron
 * que mejor le funciona a la competencia (Lety) pero con NUESTRAS respuestas
 * honestas: sin inventar clientes, sin prometer lo que esta en tramite.
 *
 * Acordeon nativo <details>/<summary>: cero JS, funciona sin hidratar y no
 * esconde contenido si un script falla (regla del noscript de la pagina).
 *
 * El array se exporta para que page.tsx arme el JSON-LD FAQPage con el MISMO
 * texto — una sola fuente, dicha dos veces (persona y buscador).
 */
export const FAQS: { q: string; a: string }[] = [
  {
    q: "¿Necesito tarjeta para probar?",
    a: "No. La prueba de 14 días no pide tarjeta ni pago. Te registrás, elegís tu rubro y usás el sistema completo.",
  },
  {
    q: "¿Qué pasa cuando termina la prueba?",
    a: "Elegís un plan y pagás por QR desde tu app bancaria, mensual o semanal. Si no pagás, tu cuenta se pausa pero tus datos no se borran de entrada: podés exportarlos o volver cuando quieras.",
  },
  {
    q: "¿La factura al SIN ya funciona?",
    a: "Nuestro sistema ya está registrado ante el SIN y la homologación está en trámite. Mientras tanto cobrás con QR y cada venta queda lista para facturar; también podés emitir por el portal gratuito del SIN. Te avisamos apenas la homologación concluya.",
  },
  {
    q: "¿El chatbot de WhatsApp está incluido?",
    a: `No, y no viene incluido en ningún plan: es un servicio aparte, ${precioStack()}. El botón de WhatsApp de tu web sí va gratis. Antes de contratarlo publicamos los requisitos: necesitás un número dedicado, y los mensajes que tu negocio inicia se los pagás directo a Meta.`,
  },
  {
    q: "¿Mis datos son míos?",
    a: "Sí. Los exportás en CSV cuando quieras en cualquier plan pago. No vendemos datos ni entrenamos modelos de IA con ellos; la política de privacidad está publicada.",
  },
  {
    q: "¿Sirve para mi rubro?",
    a: "Cinco rubros: clínicas dentales, comercios, importadoras, estéticas y servicios profesionales. Si tu negocio es otro, escribinos y lo vemos con vos.",
  },
  {
    q: "¿Cuánto tarda dejarlo andando?",
    a: "Un día. Te registrás solo, el sistema busca tus datos (tu web o tus redes) y los carga por vos. Sin instalación ni proyecto de meses.",
  },
  {
    q: "¿Hay contrato de permanencia?",
    a: "No. Pagás por adelantado el ciclo que elijas —semana, mes o año— y no renovás cuando quieras, sin penalidad. Lo pagado cubre el período en curso: por eso la prueba de 14 días va antes y sin tarjeta, para que decidas sin poner un peso.",
  },
];

/**
 * Dos columnas: el titulo y la salida por WhatsApp quedan sticky a la
 * izquierda mientras el lector recorre el acordeon — antes el acordeon media
 * 46rem y dejaba medio viewport desierto a la derecha.
 */
export function Faq() {
  return (
    <section className={styles.section} id="preguntas" aria-labelledby="faq-title">
      <div className={`${styles.container} ${styles.faqGrid}`}>
        <div className={styles.faqAside}>
          <span className={styles.kicker}>Preguntas frecuentes</span>
          <div id="faq-title">
            <SplitTextReveal
              as="h2"
              className={styles.sectionTitle}
              text="Lo que preguntan antes de empezar."
            />
          </div>
          <p className="copy">
            ¿La tuya no está? Escribinos y te contestamos con tu caso concreto.
          </p>
          <a
            className={`${styles.btn} ${styles.btnGhost}`}
            href={WA_URL_LANDING}
            target="_blank"
            rel="noopener noreferrer"
          >
            Preguntar por WhatsApp
          </a>
        </div>
        <StaggerGrid className={styles.faqList}>
          {FAQS.map((item) => (
            <StaggerItem key={item.q}>
              <details className={styles.faqItem}>
                <summary className={styles.faqQ}>{item.q}</summary>
                <p className={styles.faqA}>{item.a}</p>
              </details>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
