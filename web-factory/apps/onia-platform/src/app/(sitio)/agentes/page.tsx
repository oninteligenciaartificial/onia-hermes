import type { Metadata } from "next";
import { Entrada, Reveal } from "@/motion";
import {
  ALCANCE_AGENTE_COTIZACIONES,
  ALCANCE_AGENTE_STOCK,
  ALCANCE_CON_AGENDA,
  ALCANCE_CON_FICHA,
  PRUEBA,
  primerPlanCon,
} from "@/lib/pricing";
import { EMPEZAR_URL } from "../nav";
import { CTA_ALTA } from "../alta";
import { Block, Shape, Btn, Kicker } from "../ui";
import s from "../sitio.module.css";

const PLAN_CON_AGENTES = primerPlanCon("agentes");

export const metadata: Metadata = {
  title: "Agentes con IA que proponen y esperan tu aprobación | Onia",
  description: `Agentes con IA que cada mañana revisan tus datos según tu rubro —quién no volvió, qué pago venció, qué cita falta confirmar, qué stock quedó bajo— y te dejan la propuesta en Pendientes. Nada sale sin tu OK. Desde el plan ${PLAN_CON_AGENTES}.`,
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
 * Apartado de AGENTES. Copy verificado contra el runtime del producto
 * (`lib/onia-core/modules/agents-rotulos.ts` y `agents-por-rubro.ts` de
 * `origin/wip/v1-integracion-20260928`, 2026-09-29): cada agente corre una vez
 * por día, PROPONE y nunca envía, cobra ni compra solo. Sin imágenes.
 *
 * LOS NOMBRES dicen lo que el agente HACE (Sergio Urcullo, 29-sep-2026). Antes
 * eran nombres de rol —Recall, Cobrador, Reponedor— y dos mentían por el verbo:
 * el agente de cobros no cobra (recuerda, y el dueño aprueba) y el de stock no
 * repone (deja una tarea, no compra). Por eso nunca «Cobra» ni «Repone stock».
 * Lo vigila `(sitio)/nombres-de-agentes.test.ts`.
 *
 * DESDE QUE PLAN NO SE TIPEA ACA. Hasta el 2026-09-13 esta página decía "desde el plan Pro" en
 * cuatro lugares —el H2, el párrafo, la `description` que viaja a Google y a WhatsApp, y este
 * mismo comentario, que lo daba por verificado contra `Pro.incluye`— y las cuatro eran falsas
 * desde la escalera C (2026-09-12), que le dio `agentsIncluded` al Crece. Al lead se le pedían
 * Bs 890 por lo que ya trae un plan de Bs 550, mientras `/precios` decía bien "vienen desde
 * Crece": un comentario que afirma una verificación es lo que apaga la auditoría del que pasa
 * después. El nombre sale de `primerPlanCon("agentes")`, que lo deriva del booleano espejo.
 *
 * DÓNDE CORRE CADA UNO NO SE TIPEA ACÁ: no todos los agentes corren en todos los
 * rubros (el producto los acota por los DATOS que leen), y cada alcance sale de
 * su constante de `lib/pricing.ts`. Lo vigila `app/capacidad-acotada.test.ts`,
 * cuyos sujetos son las MENCIONES en todo `src/`, no sólo las líneas de los planes.
 */

/** Un agente: su nombre (lo que hace), qué hace, y en qué rubros corre. */
const AGENTES: readonly { nombre: string; texto: string; corre: string }[] = [
  {
    nombre: "Vuelve a citar",
    texto:
      "Detecta a quien no vuelve hace meses y no tiene próxima cita, y redacta el mensaje para invitarlo de nuevo.",
    corre: ALCANCE_CON_FICHA,
  },
  {
    nombre: "Confirma citas",
    texto:
      "Mira las citas de mañana que siguen sin confirmar y redacta el recordatorio. Si alguien no puede venir, te enterás con un día de margen.",
    corre: ALCANCE_CON_AGENDA,
  },
  {
    nombre: "Reprograma",
    texto:
      "Detecta a quien faltó o canceló y no tiene otra cita, y redacta la invitación a reprogramar. El horario lo elige quien recibe el mensaje: el agente no reserva.",
    corre: ALCANCE_CON_AGENDA,
  },
  {
    nombre: "Recuerda cobros",
    texto:
      "Detecta los saldos vencidos y redacta el recordatorio de pago. No cobra nada: vos aprobás el mensaje y el pago te llega a vos.",
    corre: "en todos los rubros",
  },
  {
    nombre: "Avisa stock bajo",
    texto:
      "Detecta los productos que quedaron en o por debajo del mínimo que cargaste y te deja la tarea de pedirle al proveedor. No compra ni le escribe a nadie.",
    corre: ALCANCE_AGENTE_STOCK,
  },
  {
    nombre: "Sigue cotizaciones",
    texto:
      "Detecta las cotizaciones que mandaste y siguen sin respuesta, y redacta el mensaje para retomarlas. Las que ya vencieron no las persigue.",
    corre: ALCANCE_AGENTE_COTIZACIONES,
  },
];

export default function Agentes() {
  return (
    <>
      <Block surface="ink">
        <div className={s.split}>
          <Entrada>
            <div>
              <Kicker>Agentes con IA</Kicker>
              <h1 className={s.display}>
                Revisan tus datos antes de que abras. No <em>deciden</em> solos.
              </h1>
              {/* La bajada del titular «Agentes con IA» (Sergio Urcullo,
                  2026-09-28): el titular se queda porque la IA es real en UNA
                  cosa y esta frase dice cuál. Corregido 2026-10-01: la IA NO
                  escribe cada mensaje. Con AGENTS_LLM=1 redacta UNA plantilla
                  por negocio y por agente, el dueño la aprueba una vez en
                  /agents y el sistema la completa en cada propuesta
                  (onia-platform lib/onia-core/modules/agents-plantilla.ts,
                  cabecera y generarPlantilla). A quién y cuándo lo deciden
                  reglas fijas sobre tus datos (agents-runtime.ts), no la IA. */}
              <p className={s.lead}>
                La IA redacta el texto de cada agente y vos lo aprobás una vez;
                a quién y cuándo lo decide el sistema con tus datos. Cada
                mañana te deja los mensajes listos: lo que te sirve sale por tu
                WhatsApp, o te queda para mandarlo con un toque.
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
          </Entrada>
          <Entrada delay={0.08}>
            <Shape tone="signal" panel="agentes" />
          </Entrada>
        </div>
      </Block>

      {/* Los agentes, uno por fila: qué hace y dónde corre */}
      <Block surface="paper" labelledBy="trato">
        <Reveal>
          <Kicker>Los agentes</Kicker>
          <h2 id="trato" className={s.h2}>
            La máquina hace el trabajo aburrido. La decisión sigue siendo tuya.
          </h2>
          <p className={s.body} style={{ maxWidth: "46em", marginTop: "1.2em" }}>
            Cada agente se llama por lo que hace y corre solo en los rubros que
            tienen los datos que lee. Cada propuesta espera en Pendientes hasta
            que alguien la aprueba; ninguna sale sola, y podés descartarla sin
            explicar nada.
          </p>
          <div className={s.cells}>
            {AGENTES.map(({ nombre, texto, corre }) => (
              <div key={nombre} className={s.cell}>
                <h3 className={s.h3}>{nombre}</h3>
                <p>
                  {texto} Corre {corre}.
                </p>
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
            agentes que te proponen a quién contactar y a quién recordarle un pago. No es
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
