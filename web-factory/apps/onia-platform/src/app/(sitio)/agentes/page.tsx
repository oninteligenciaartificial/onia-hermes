import type { Metadata } from "next";
import { Reveal } from "@/motion";
import { PRUEBA } from "@/lib/pricing";
import { EMPEZAR_URL } from "../nav";
import { CTA_ALTA } from "../alta";
import { Block, Shape, Btn, Kicker } from "../ui";
import s from "../sitio.module.css";

export const metadata: Metadata = {
  title: "Agentes con IA que proponen y esperan tu aprobación | Onia",
  description:
    "Recall detecta al cliente que no vuelve y Cobrador detecta la deuda vencida: los dos redactan el mensaje y lo dejan en Pendientes. Nada sale sin tu OK. Incluidos desde el plan Pro.",
  alternates: { canonical: "/agentes" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Trabajan de noche. No deciden solos.",
    description:
      "Los agentes revisan tus datos con el negocio cerrado y dejan un borrador esperando. A la mañana aprobás lo que sirve.",
    url: "/agentes",
  },
};

/**
 * Apartado de AGENTES. Copy verificado contra la pantalla real de Agentes del
 * producto (Recall y Cobrador, cada 24h, PROPONEN y nunca envían solos). Nada
 * de esto es promesa: existe. Los agentes vienen desde el plan Pro
 * (lib/pricing.ts → Pro.incluye). Sin imágenes.
 */

const CELDAS: readonly [string, string][] = [
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
];

export default function Agentes() {
  return (
    <>
      <Block surface="ink">
        <div className={s.split}>
          <Reveal>
            <div>
              <Kicker>Agentes con IA</Kicker>
              <h1 className={s.display}>
                Trabajan de noche. No <em>deciden</em> solos.
              </h1>
              <p className={s.lead}>
                Los agentes revisan tus datos mientras el negocio está cerrado y
                dejan un borrador esperando. A la mañana ves qué proponen,
                aprobás lo que te sirve y se manda.
              </p>
              <div className={s.actions}>
                <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
                <Btn href="/precios" variant="line">
                  Ver desde qué plan
                </Btn>
              </div>
              {/* El boton dice el verbo real del alta (sale de ../alta, que
                  sigue a ONIA_ALTA_AUTOMATICA); la promesa de la prueba baja a
                  la nota, como en la home. */}
              <p className={s.note} style={{ marginTop: "1.2em" }}>
                {PRUEBA.dias} días gratis · sin tarjeta
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <Shape
              tone="signal"
              ratio="4 / 3"
              src="/v2/capturas/pendientes.webp"
              width={1680}
              height={1260}
              alt="Pantalla de pendientes de Onia: cada propuesta del sistema espera el boton de aprobar y ninguna sale sola."
            />
          </Reveal>
        </div>
      </Block>

      {/* El trato, en tres celdas */}
      <Block surface="paper" labelledBy="trato">
        <Reveal>
          <Kicker>El trato</Kicker>
          <h2 id="trato" className={s.h2}>
            La máquina hace el trabajo aburrido. La decisión sigue siendo tuya.
          </h2>
          <div className={s.cells}>
            {CELDAS.map(([titulo, texto]) => (
              <div key={titulo} className={s.cell}>
                <h3 className={s.h3}>{titulo}</h3>
                <p>{texto}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Block>

      {/* Desde qué plan */}
      <Block surface="green" labelledBy="plan">
        <Reveal>
          <Kicker>Desde qué plan</Kicker>
          <p id="plan" className={s.h2} style={{ maxWidth: "22ch" }}>
            Los agentes vienen incluidos desde el plan Pro.
          </p>
          <p className={s.body} style={{ maxWidth: "46em" }}>
            El plan Básico ordena tu negocio; el Pro le suma los agentes que te
            proponen a quién contactar y a quién cobrarle. No es un cobro extra:
            está adentro del plan.
          </p>
          <div className={s.actions}>
            <a className={s.link} href="/precios">
              Ver los planes →
            </a>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
