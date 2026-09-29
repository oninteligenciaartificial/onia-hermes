import type { Metadata } from "next";
import { Reveal } from "@/motion";
import { ALCANCE_CON_FICHA, PRUEBA, primerPlanCon } from "@/lib/pricing";
import { EMPEZAR_URL } from "../nav";
import { CTA_ALTA } from "../alta";
import { Block, Shape, Btn, Kicker } from "../ui";
import s from "../sitio.module.css";

const PLAN_CON_AGENTES = primerPlanCon("agentes");

export const metadata: Metadata = {
  title: "Agentes con IA que proponen y esperan tu aprobación | Onia",
  description: `Recall detecta al cliente que no vuelve (${ALCANCE_CON_FICHA}) y Cobrador detecta la deuda vencida, en todos los rubros: los dos redactan el mensaje y lo dejan en Pendientes. Nada sale sin tu OK. Incluidos desde el plan ${PLAN_CON_AGENTES}.`,
  alternates: { canonical: "/agentes" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Revisan tus datos antes de que abras. No deciden solos.",
    description:
      "Cada mañana, antes de que abras, los agentes revisan tus datos y te dejan un borrador esperando. Aprobás lo que sirve.",
    url: "/agentes",
  },
};

/**
 * Apartado de AGENTES. Copy verificado contra la pantalla real de Agentes del
 * producto (Recall y Cobrador, cada 24h, PROPONEN y nunca envían solos). Nada
 * de esto es promesa: existe. Sin imágenes.
 *
 * DESDE QUE PLAN NO SE TIPEA ACA. Hasta el 2026-09-13 esta página decía "desde el plan Pro" en
 * cuatro lugares —el H2, el párrafo, la `description` que viaja a Google y a WhatsApp, y este
 * mismo comentario, que lo daba por verificado contra `Pro.incluye`— y las cuatro eran falsas
 * desde la escalera C (2026-09-12), que le dio `agentsIncluded` al Crece. Al lead se le pedían
 * Bs 890 por lo que ya trae un plan de Bs 550, mientras `/precios` decía bien "vienen desde
 * Crece": un comentario que afirma una verificación es lo que apaga la auditoría del que pasa
 * después. El nombre sale de `primerPlanCon("agentes")`, que lo deriva del booleano espejo.
 *
 * El alcance del Recall NO se tipea acá: sale de `ALCANCE_CON_FICHA`, que se
 * deriva de `ALCANCE_POR_DATOS` (lib/pricing.ts, con la medición contra el
 * producto). Esta página describía la capacidad ROL POR ROL, fuera de `PLANES`,
 * y por eso los dos gates del eje (capacidad, rubro) —que sacan sus sujetos de
 * las líneas de los planes y de la nav de los packs— pasaban en verde sobre
 * ella. Lo vigila `app/capacidad-acotada.test.ts`.
 */

const CELDAS: readonly [string, string][] = [
  [
    "Recall",
    `Detecta clientes que no vuelven hace meses y no tienen próxima cita, y redacta el mensaje para traerlos. Corre cada 24 horas, ${ALCANCE_CON_FICHA} — son los rubros que guardan ficha del cliente y agenda.`,
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
                Revisan tus datos antes de que abras. No <em>deciden</em> solos.
              </h1>
              <p className={s.lead}>
                Cada mañana los agentes te dejan escritos los mensajes que
                proponen. Aprobás lo que te sirve y sale por tu WhatsApp, o te
                queda listo para mandarlo con un toque.
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
            <Shape tone="signal" panel="agentes" />
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
            Los agentes vienen incluidos desde el plan {PLAN_CON_AGENTES}.
          </p>
          <p className={s.body} style={{ maxWidth: "46em" }}>
            El plan Básico ordena tu negocio; el {PLAN_CON_AGENTES} le suma los
            agentes que te proponen a quién contactar y a quién cobrarle. No es
            un cobro extra: está adentro del plan.
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
