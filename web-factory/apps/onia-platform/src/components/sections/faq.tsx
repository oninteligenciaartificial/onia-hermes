"use client";

import { Reveal, StaggerGrid, StaggerItem } from "@/motion";
import { WA_URL } from "@/lib/site";
import styles from "./faq.module.css";

/**
 * Seccion "Preguntas" — acordeon nativo (<details>/<summary>): accesible y
 * cero JS. Las respuestas siguen el compliance C7: portal del SIN gratis de
 * frente, agente que REPROGRAMA con aprobacion, boton de WhatsApp gratis vs.
 * chatbot pago, precios solo DentalGest, cero promesas inventadas.
 */

const FAQS = [
  {
    q: "¿No puedo facturar gratis en el portal del SIN?",
    a: "Sí, podés — el portal del SIN es gratuito y cumple la ley. La diferencia es el trabajo: ahí tipeás cada factura a mano, todos los días. Con Onia la factura sale sola del cobro que ya registraste. No te vendemos la obligación; te ahorramos el tipeo.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "DentalGest, el primer rubro disponible, arranca desde Bs 320/mes — precios de lanzamiento. Los demás módulos (chatbot, web, agentes, automatizaciones, versión local) se cotizan según tu caso: hablanos por WhatsApp y te armamos la cuenta a medida.",
  },
  {
    q: "¿Los agentes hacen cosas sin avisarme?",
    a: "No. Los agentes proponen; vos aprobás. Detectan huecos, preparan cobros, redactan reprogramaciones — y todo queda en una cola esperando tu OK. No mandan mensajes a tus clientes por su cuenta ni toman decisiones a tus espaldas.",
  },
  {
    q: "Mi rubro todavía no está. ¿Qué hago?",
    a: "Hoy está disponible DentalGest (clínicas dentales). Comercio, servicios y proveedores se están construyendo sobre el mismo motor. Anotate por WhatsApp y te avisamos cuando tu rubro esté listo — sin humo: no vendemos lo que no existe.",
  },
  {
    q: "¿Necesito instalar algo o saber de sistemas?",
    a: "No. La cuenta se arma con lo esencial de tu rubro ya configurado y la dejamos lista con vos en una llamada. Y si tu internet es poco confiable, existe el módulo local: Onia corre en tu equipo y sincroniza cuando vuelve la conexión.",
  },
  {
    q: "¿El chatbot de WhatsApp no viene incluido con la web?",
    a: "El botón de WhatsApp en tu web va incluido gratis: el visitante te escribe con un clic. El chatbot es otra cosa — un bot que conversa por vos, responde consultas, califica interesados y te deriva los que valen la pena. Ese es un módulo aparte, a cotizar.",
  },
] as const;

export function Faq() {
  return (
    <section id="preguntas" className={`section ${styles.section}`}>
      <div className="container">
        <Reveal>
          <p className="kicker">Preguntas</p>
          <h2 className="h2">Lo que nos preguntan antes de entrar.</h2>
        </Reveal>

        <StaggerGrid className={styles.list} stagger={0.05}>
          {FAQS.map((f) => (
            <StaggerItem key={f.q} className={styles.itemWrap}>
              <details className={styles.item}>
                <summary className={styles.q}>
                  {f.q}
                  <span className={styles.marker} aria-hidden />
                </summary>
                <p className={styles.a}>{f.a}</p>
              </details>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <Reveal className={styles.more}>
          <p>
            ¿Otra pregunta?{" "}
            <a href={WA_URL}>Escribinos por WhatsApp</a> — responde una
            persona, no un menú.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
