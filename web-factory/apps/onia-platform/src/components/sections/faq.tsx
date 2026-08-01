"use client";

import { Reveal, StaggerGrid, StaggerItem } from "@/motion";
import { useRubro } from "@/components/rubro-context";
import { waLink } from "@/lib/site";
import { rubroPlanes, textoDudaPrecio } from "@/lib/pricing";
import styles from "./faq.module.css";

/**
 * Seccion "Objeciones" — acordeon nativo (<details>/<summary>): accesible y
 * cero JS. No son "preguntas frecuentes" de relleno: son las objeciones reales
 * que aparecen en la venta, con la respuesta que damos en la llamada.
 *
 * Fuente literal del argumento: hermes-content/sales-kit/04-OBJECIONES.md.
 * Reglas duras que se respetan aca:
 *  - El Portal Web del SIN es gratis y lo decimos NOSOTROS primero.
 *  - Nunca "por ley tenés que comprarnos".
 *  - Cero clientes, testimonios o casos inventados.
 *  - Datos regionales siempre marcados (Colombia y Chile, no "en Bolivia").
 *  - El agente REPROGRAMA (llena el hueco), no "manda recordatorios".
 */

const FAQS = [
  {
    tema: "Fiscal",
    q: "Ya puedo facturar gratis en el portal del SIN.",
    a: "Sí, podés — y te lo decimos nosotros antes de que lo googlees: el Portal Web del SIN es gratuito y cumple la ley. La diferencia es el trabajo: ahí tipeás cada factura a mano, una por una. En Onia la venta ya queda cerrada con el paciente, el monto y el detalle, para no volver a tipear lo mismo. Y de frente: nuestro emisor todavía está en trámite de homologación ante el SIN, así que hoy la factura fiscal la emitís en el portal. No te vendemos una obligación que no existe.",
  },
  {
    tema: "Precio",
    q: "Es caro.",
    a: "Hacé la cuenta con tus números en vez de con la sensación. El Pro son Bs 750 al mes: lo que cobrás por dos ajustes de ortodoncia (Bs 300–350 cada uno en Santa Cruz). Si evita que dos pacientes te fallen en el mes, ya se pagó. El Full son Bs 1.500, media endodoncia multirradicular (Bs 2.100): una sola recuperada paga el mes y te sobran Bs 600. Y si aún así te queda grande, el Básico son Bs 320 — lo que cobrás por tres consultas.",
  },
  {
    tema: "Uso",
    q: "No sé usar sistemas, y mi equipo menos.",
    a: "No hay nada que instalar y la configuración no la hacés vos: te dejamos la cuenta lista con tus datos cargados y capacitamos a tu equipo — en esta fase de lanzamiento la implementación va regalada. Después, cada uno ve solo lo suyo: la recepción abre la agenda del día y cobra; la historia clínica no le aparece. Si tu equipo usa WhatsApp, puede usar esto.",
  },
  {
    tema: "Riesgo",
    q: "¿Y si se cae el internet?",
    a: "Honesto: Onia anda en la nube, así que sin ninguna conexión no vas a poder trabajar en ese rato — igual que con el portal del SIN o cualquier sistema en línea. Lo que sí resolvés es lo importante: si se corta el wifi de la clínica seguís desde el celular con datos, y no perdés nada. Tus datos no viven en la computadora del mostrador: si se quema o te la roban, tu información está intacta y la abrís desde otro aparato.",
  },
  {
    tema: "Confianza",
    q: "¿Quién más lo usa?",
    a: "Estamos arrancando y no te vamos a inventar clientes ni testimonios: serías de las primeras clínicas. Justamente por eso te conviene — la implementación va regalada, el precio de lanzamiento te lo respetamos 12 meses y nos tenés a nosotros directo, no a un call center en otro país. Y tus datos son tuyos: si un día te querés ir, te los llevás exportados.",
  },
  {
    tema: "Tamaño",
    q: "Somos muy chicos para esto.",
    a: "Al revés: cuanto más chica la clínica, más duele cada silla vacía. En la región se pierde entre el 10% y el 30% de las citas (datos de Colombia y Chile; en Bolivia no hay estudio publicado). Contá cuántas te fallaron el mes pasado y multiplicá por lo que cobrás. Si el número es chico, decímelo y te digo que todavía no lo necesitás.",
  },
  {
    tema: "Agentes",
    q: "¿Los agentes hacen cosas sin avisarme?",
    a: "No. Los agentes proponen; vos aprobás. Detectan el hueco que dejó el paciente que faltó, redactan la reprogramación, preparan el cobro — y todo queda en una cola esperando tu OK. No le escriben a tus pacientes por su cuenta ni deciden a tus espaldas.",
  },
  {
    tema: "Datos",
    q: "¿Mis datos están seguros?",
    a: "Tres cosas concretas, sin certificaciones inventadas. Uno: los datos viajan cifrados y viven en infraestructura de nube profesional con respaldos, no en una PC que se puede quemar. Dos: acceso por roles — cada uno ve solo lo suyo. Tres: son tuyos, los exportás cuando quieras y si te vas, te los llevás.",
  },
  {
    tema: "Rubros",
    q: "Mi rubro todavía no está. ¿Qué hago?",
    a: "Hoy el pack que está andando es el dental. Importadora es el que sigue, y comercio y servicios están más atrás — todos sobre el mismo motor. No vendemos lo que no existe ni le ponemos precio a lo que no está listo: escribinos y te decimos qué se puede hacer hoy con tu caso (web, chatbot y automatizaciones sí existen ya).",
  },
  {
    tema: "Add-ons",
    q: "¿El chatbot de WhatsApp no viene incluido con la web?",
    a: "El botón de WhatsApp en tu web va incluido gratis: el visitante te escribe con un clic. El chatbot es otra cosa — un bot que conversa por vos, responde consultas, califica interesados y te deriva los que valen la pena. Ese es un add-on aparte, con su setup y su mensual, publicado en la sección de precios.",
  },
] as const;

export function Faq() {
  const { rubro } = useRubro();
  const actual = rubroPlanes(rubro);

  return (
    <section id="preguntas" className={`section ${styles.section}`}>
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.intro}>
          <p className="kicker">Objeciones</p>
          <h2 className={`h2 ${styles.titulo}`}>
            Lo que nos dicen antes de decir que sí.
          </h2>
          <p className={styles.introBody}>
            No son preguntas de relleno: son las objeciones reales que salen en
            la venta, con la misma respuesta que damos por teléfono. Si algo
            todavía no funciona, lo vas a leer acá antes que en la letra chica.
          </p>
          <p className={styles.more}>
            ¿Te falta una?{" "}
            <a href={waLink(textoDudaPrecio(actual))}>Preguntala por WhatsApp</a>{" "}
            — responde una persona, no un menú.
          </p>
        </Reveal>

        <StaggerGrid className={styles.list} stagger={0.05}>
          {FAQS.map((f) => (
            <StaggerItem key={f.q} className={styles.itemWrap}>
              <details className={styles.item}>
                <summary className={styles.q}>
                  <span className={styles.qTexto}>
                    <span className={`mono ${styles.tema}`}>{f.tema}</span>
                    {f.q}
                  </span>
                  <span className={styles.marker} aria-hidden />
                </summary>
                <p className={styles.a}>{f.a}</p>
              </details>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
