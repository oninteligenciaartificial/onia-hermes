import type { Metadata } from "next";

import { RUBROS_VIVOS } from "@/content/rubros";
import {
  PLANES,
  PRUEBA,
  ALCANCE_CON_AGENDA,
  ALCANCE_CON_INVENTARIO,
  bs,
  planDeEntrada,
  primerPlanCon,
} from "@/lib/pricing";
import { SITE_URL, WA_URL_LANDING } from "@/lib/site";

import { ALTA_VERBO_VOS_TITULO, CTA_ALTA } from "./alta";
import { EMPEZAR_URL } from "./nav";
import { Block, Btn, JsonLd, Kicker, PanelDibujado } from "./ui";
import s from "./sitio.module.css";
import p from "./portada.module.css";

/** La misma fuente alimenta el hero, el precio y los datos estructurados. */
const PLAN_DE_ENTRADA = planDeEntrada();
const DESDE_MES = `Bs ${bs(PLAN_DE_ENTRADA.mensual)}`;
const TITULO =
  "Onia · Todo el negocio en una pantalla | Software de gestión Bolivia";
const DESCRIPCION = `Onia es el sistema con el que llevás tu negocio en Bolivia: fichas de clientes, caja y cobros en un solo lugar —más inventario ${ALCANCE_CON_INVENTARIO} y agenda ${ALCANCE_CON_AGENDA}—, ya armado para tu rubro. Desde ${DESDE_MES} al mes. ${PRUEBA.dias} días gratis, sin tarjeta.`;
const OG_TITULO = "Todo el negocio, en una pantalla. — Onia, Bolivia";
const OG_DESCRIPCION = `Onia junta clientes, caja y cobros en un solo sistema —más inventario ${ALCANCE_CON_INVENTARIO} y agenda ${ALCANCE_CON_AGENDA}—, armado para tu rubro. Desde ${DESDE_MES} al mes, ${PRUEBA.dias} días gratis y sin tarjeta.`;

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    siteName: "Onia",
    title: OG_TITULO,
    description: OG_DESCRIPCION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITULO,
    description: OG_DESCRIPCION,
  },
};

/** La FAQ vive en /precios; no se anuncia en JSON-LD si no aparece en la home. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Onia",
      legalName: "OniaAgency",
      url: `${SITE_URL}/`,
      areaServed: { "@type": "Country", name: "Bolivia" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Santa Cruz de la Sierra",
        addressCountry: "BO",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Onia",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: `${SITE_URL}/`,
      publisher: { "@id": `${SITE_URL}/#org` },
      // La emisión fiscal no es capacidad de Onia: no se presenta como tal.
      description: `Sistema de gestión con IA para negocios en Bolivia: clientes, cobros y agentes con aprobación humana —más inventario ${ALCANCE_CON_INVENTARIO} y agenda ${ALCANCE_CON_AGENDA}—.`,
      offers: PLANES.map((item) => ({
        "@type": "Offer",
        name: item.nombre,
        price: String(item.mensual),
        priceCurrency: "BOB",
        category: "Suscripción mensual",
        availability: "https://schema.org/InStock",
      })),
    },
  ],
};

/** Resúmenes de orientación, no una segunda lista de módulos o rubros. */
const RESULTADO_POR_RUBRO: Record<string, string> = {
  Dental: "Pacientes y citas en orden.",
  Comercio: "Caja y cobros a la vista.",
  Importadora: "Productos, lotes y costos.",
  Estética: "Agenda y seguimiento de clientas.",
  Servicios: "Clientes y trabajo por cobrar.",
};

const TAREAS = [
  {
    numero: "01",
    panel: "cuenta" as const,
    plan: PLAN_DE_ENTRADA.id,
    titulo: "Ves cómo va el día.",
    texto: "Clientes, caja y cobros juntos, sin cruzar planillas al cerrar.",
    href: "/rubros",
    link: "Ver tu rubro",
  },
  {
    numero: "02",
    panel: "chat" as const,
    titulo: "Atendés la consulta.",
    texto: "Tu agente conversacional responde por WhatsApp con la información que publicaste. Se incluye en algunos planes o se suma aparte.",
    href: "/chatbot",
    link: "Ver el agente conversacional",
  },
  {
    numero: "03",
    panel: "agentes" as const,
    titulo: "Decidís a quién seguir.",
    texto: `Desde ${primerPlanCon("agentes")}, los agentes preparan recordatorios y avisos de pago. Vos aprobás cada envío.`,
    href: "/agentes",
    link: "Ver los agentes",
  },
] as const;

/** Portada 1.0: decisión rápida; las explicaciones completas viven adentro. */
export default function Portada() {
  return (
    <>
      <JsonLd data={JSON_LD} />

      {/* 1 · HERO: promesa, muestra ilustrativa y primera decisión. */}
      <Block surface="green" className={p.heroVerde}>
        <span className={`${p.halo} ${p.haloA}`} aria-hidden="true" />
        <span className={`${p.halo} ${p.haloB}`} aria-hidden="true" />
        <div className={p.heroEntrada}>
          <div className={p.centro}>
            <Kicker>Un solo sistema para tu negocio</Kicker>
            <h1 className={p.heroTitulo}>
              Todo el negocio, en <em>una</em> pantalla.
            </h1>
            <p className={p.heroLead}>
              Clientes, caja y cobros en un lugar, con una cuenta preparada para
              tu rubro. Hecho para negocios en Bolivia.
            </p>
            <div className={p.heroCtas}>
              <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
              <Btn href="/rubros" variant="line">Ver cómo funciona</Btn>
            </div>
            <p className={p.heroNota}>
              {PRUEBA.dias} días de prueba con el plan {PRUEBA.planQueCorre}, sin
              tarjeta. Después, desde Bs {bs(PLAN_DE_ENTRADA.mensual)} al mes.
            </p>
            <div className={p.escena}>
              <div className={p.escenaPanel}>
                <PanelDibujado panel="cuenta" plan={PLAN_DE_ENTRADA.id} />
              </div>
              <p className={p.escenaNota}>Vista ilustrativa del plan de entrada.</p>
            </div>
          </div>
        </div>
      </Block>

      {/* 2 · RUBROS: cinco opciones que salen de la fuente del alta. */}
      <Block surface="paper" labelledBy="rubros" className={p.bloqueCorto}>
        <div className={p.sectionIntro}>
          <Kicker>Tu negocio primero</Kicker>
          <h2 id="rubros" className={s.h2}>Elegís tu rubro. La cuenta toma su forma.</h2>
          <p className={s.body}>El mismo sistema, con las pantallas y palabras que usás cada día.</p>
        </div>
        <div className={p.rubrosGrid}>
          {RUBROS_VIVOS.map((rubro, index) => (
            <a className={p.rubro} href="/rubros" key={rubro.chip}>
              <span className={p.rubroNumero}>0{index + 1}</span>
              <strong>{rubro.chip}</strong>
              <span>{RESULTADO_POR_RUBRO[rubro.chip] ?? "Una cuenta preparada para tu negocio."}</span>
              <span className={p.rubroFlecha} aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </Block>

      {/* 3 · TAREAS: tres usos concretos; cada límite se explica en su página. */}
      <Block surface="paperDim" labelledBy="tareas" className={p.bloqueCorto}>
        <div className={p.sectionIntro}>
          <Kicker>En el trabajo diario</Kicker>
          <h2 id="tareas" className={s.h2}>Menos vueltas. Más claro qué hacer.</h2>
        </div>
        <div className={p.tareasGrid}>
          {TAREAS.map((tarea) => (
            <article className={p.tarea} key={tarea.numero}>
              <div className={p.tareaArte}>
                <PanelDibujado panel={tarea.panel} plan={"plan" in tarea ? tarea.plan : undefined} />
              </div>
              <div className={p.tareaCuerpo}>
                <span className={p.tareaNumero}>{tarea.numero} / 03</span>
                <h3>{tarea.titulo}</h3>
                <p>{tarea.texto}</p>
                <a className={s.link} href={tarea.href}>{tarea.link} →</a>
              </div>
            </article>
          ))}
        </div>
      </Block>

      {/* 4 · PRECIO: el piso real, sin reconstruir aquí el catálogo completo. */}
      <Block surface="paper" labelledBy="precio" className={p.bloqueCorto}>
        <div className={p.precioGrid}>
          <div>
            <Kicker>Precio de entrada</Kicker>
            <h2 id="precio" className={s.h2}>Empezá con lo que necesitás.</h2>
            <p className={s.body}>Probás {PRUEBA.dias} días con el plan {PRUEBA.planQueCorre} completo. Después elegís el plan que te conviene.</p>
            <a className={s.link} href="/precios">Comparar planes y condiciones →</a>
          </div>
          <div className={p.precioDato}>
            <span>Planes desde</span>
            <strong>Bs {bs(PLAN_DE_ENTRADA.mensual)}</strong>
            <span>al mes · plan {PLAN_DE_ENTRADA.nombre}</span>
            <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
          </div>
        </div>
        <p className={p.precioNota}>
          La factura con valor fiscal se emite en el Portal Web del SIN, que es gratuito. <a href="/facturacion">Qué exige la facturación en línea</a>.
        </p>
      </Block>

      {/* 5 · CIERRE: un siguiente paso, con conversación humana disponible. */}
      <Block surface="ink" labelledBy="cierre" className={p.cierre}>
        <div className={p.centro}>
          <Kicker>Empezá con tu negocio</Kicker>
          <h2 id="cierre" className={s.display}>{ALTA_VERBO_VOS_TITULO} y ves las pantallas de tu rubro.</h2>
          <div className={p.heroCtas}>
            <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
            <Btn href={WA_URL_LANDING} variant="line" external>Hablar con ONIA</Btn>
          </div>
        </div>
      </Block>
    </>
  );
}
