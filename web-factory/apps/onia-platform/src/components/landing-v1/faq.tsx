import { SplitTextReveal, StaggerGrid, StaggerItem } from "@/motion";
import { PRUEBA, nombresConChatbot, traeOTraen } from "@/lib/pricing";
import { WA_URL_LANDING } from "@/lib/site";
import { precioStack } from "@/content/chatbot-precios";
import { CUANTOS_RUBROS_CAPITAL } from "@/content/rubros";
import { MEDIO_DE_PAGO } from "@/content/medio-de-pago";
import { DE_DONDE_LLEGA_EL_ENLACE, PASO_CONFIRMAR_CORREO } from "@/app/(sitio)/alta";
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
    // El paso del medio sale de `alta.ts`, no se tipea: el alta exige confirmar
    // el correo y esta enumeración lo salteaba, igual que su gemela de la home.
    a: `No. La prueba de ${PRUEBA.dias} días no pide tarjeta ni pago. Te registrás, ${PASO_CONFIRMAR_CORREO} ${DE_DONDE_LLEGA_EL_ENLACE}, elegís tu rubro y usás el plan ${PRUEBA.planQueCorre} completo.`,
  },
  {
    q: "¿Qué pasa cuando termina la prueba?",
    // El medio de pago NO se tipea: lo dice `@/content/medio-de-pago`, que sigue
    // a la capacidad que producción tiene encendida. Acá decía «pagás por QR» y
    // no existe ningún QR — ver el encabezado de ese módulo.
    a: `${MEDIO_DE_PAGO.alTerminarLaPrueba} Si no pagás, tu cuenta se pausa pero tus datos no se borran de entrada: podés exportarlos o volver cuando quieras.`,
  },
  {
    q: "¿La factura al SIN ya funciona?",
    a: "Nuestro sistema ya está registrado ante el SIN y la homologación está en trámite. Mientras tanto cobrás con QR y cada venta queda lista para facturar; también podés emitir por el portal gratuito del SIN. Te avisamos apenas la homologación concluya.",
  },
  {
    q: "¿El chatbot de WhatsApp está incluido?",
    // Depende del plan. Decía "no viene incluido en ningún plan" y era falso para Full desde la
    // escalera C: le cobraba Bs 390/mes a quien ya lo tenía pagado adentro. Quién lo trae sale del
    // catálogo (`chatbotIncluido`), no se tipea — lo ata `scripts/inclusion-chatbot.mjs`.
    a: `${nombresConChatbot()} ya ${traeOTraen()} el chatbot de WhatsApp incluido. En los demás planes va aparte, ${precioStack()}. El botón de WhatsApp de tu web sí va gratis. Antes de contratarlo publicamos los requisitos: necesitás un número dedicado, y los mensajes que tu negocio inicia se los pagás directo a Meta.`,
  },
  {
    // Sin condición de plan a propósito: el export integral es un derecho del
    // titular y el producto no lo gatea (ver `datos-que-se-llevan.test.ts`).
    q: "¿Mis datos son míos?",
    a: "Sí. Los exportás en CSV cuando quieras, también durante la prueba: llevarte tus datos es un derecho tuyo, no una función del plan. No vendemos datos ni entrenamos modelos de IA con ellos; la política de privacidad está publicada.",
  },
  {
    q: "¿Sirve para mi rubro?",
    a: `${CUANTOS_RUBROS_CAPITAL} rubros: clínicas dentales, comercios, importadoras, estéticas y servicios profesionales. Si tu negocio es otro, escribinos y lo vemos con vos.`,
  },
  {
    q: "¿Cuánto tarda dejarlo andando?",
    // Esta respuesta viaja además al JSON-LD FAQPage que arma `page.tsx`, así
    // que la promesa la publica también el buscador. Decía «el sistema busca
    // tus datos (tu web o tus redes)»: eso es el paso (3) del motor de alta,
    // que necesita `SEARXNG_URL` y en producción devuelve vacío. Lo que sí
    // corre es leer el enlace que la persona pega. Ver capacidad-degradada.test.ts.
    a: `Un día. Te registrás solo, ${PASO_CONFIRMAR_CORREO} ${DE_DONDE_LLEGA_EL_ENLACE}, pegás el enlace de tu web y el sistema carga tus datos por vos. Sin instalación ni proyecto de meses.`,
  },
  {
    q: "¿Hay contrato de permanencia?",
    a: `No. Pagás por adelantado el ciclo que elijas —semana, mes o año— y no renovás cuando quieras, sin penalidad. Lo pagado cubre el período en curso: por eso la prueba de ${PRUEBA.dias} días va antes y sin tarjeta, para que decidas sin poner un peso.`,
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
