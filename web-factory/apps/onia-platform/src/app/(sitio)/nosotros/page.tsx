import type { Metadata } from "next";
import { PRUEBA, RETENCION } from "@/lib/pricing";
import { Entrada, Reveal } from "@/motion";
import { WA_URL_LANDING, SITE_URL, CORREO_CONTACTO } from "@/lib/site";
import { CUANTOS_RUBROS_CAPITAL } from "@/content/rubros";
import { EMPEZAR_URL } from "../nav";
import { CTA_ALTA } from "../alta";
import { Block, Btn, Kicker, JsonLd } from "../ui";
import s from "../sitio.module.css";

export const metadata: Metadata = {
  title: "Quiénes somos — Onia",
  description:
    "Onia (OniaAgency) es una empresa boliviana de Santa Cruz que construye el sistema de gestión con IA para negocios de Bolivia. Registrados en SEPREC, con NIT vigente y el sistema en producción: así trabajamos.",
  alternates: { canonical: "/nosotros" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Quiénes somos — Onia",
    description: "Empresa boliviana, tecnología real, honestidad primero.",
    url: "/nosotros",
  },
};

/**
 * /nosotros — la señal de confianza que toda marca desconocida necesita antes
 * de que alguien le entregue los datos de su negocio (patrón Alegra/Siigo).
 *
 * VIVE DENTRO DE `(sitio)` desde 2026-08-23. Antes colgaba del cromo v1
 * (SiteHeader/SiteFooter) y NO estaba en ningún nav de la v3: existía, estaba
 * en el sitemap y era inalcanzable salvo por el header viejo que ya no envuelve
 * al sitio. Con cero clientes pagando, esta señal institucional —empresa
 * boliviana, SEPREC, NIT, Santa Cruz— es el sustituto legítimo del testimonio;
 * escondida no sirve de nada. La URL no cambió: el grupo de rutas no sale en la
 * ruta, así que el sitemap y el canonical siguen igual.
 *
 * REGLA DE COPY (2026-08-15, pedido de Sergio): la página NO anuncia que la
 * empresa es nueva ni que todavía no hay clientes — eso contesta el miedo del
 * comprador («¿y si no funciona?») dándole la razón. Se contesta con lo
 * verificable y comprobable por él: 14 días con el plan que corre la prueba
 * completo, sin tarjeta, sin permanencia y con los datos exportables en CSV.
 * («el sistema completo» hasta el 2026-09-18: ver `prueba-vs-plan.test.ts`.)
 * Sigue prohibido el
 * camino opuesto: inventar clientes, logos, testimonios o métricas.
 * Cada garantía de acá está verificada contra src/lib/pricing.ts, que a su vez
 * sale del código que cobra. Los datos legales coinciden con el pie y con el
 * portfolio de Meta — no tocar sin actualizar los tres.
 */
const PRINCIPIOS = [
  {
    titulo: "Honestidad primero",
    detalle:
      "Publicamos lo que el sistema hace hoy, con su alcance y sus condiciones. Preferimos que lo leas antes de contratar y no que lo descubras en la primera semana.",
  },
  {
    titulo: "Los agentes proponen, vos aprobás",
    detalle:
      "Revisan tus datos cada mañana antes de que abras, pero nada sale hacia un cliente tuyo sin tu OK. Human-in-the-loop no es un adorno: es la arquitectura.",
  },
  {
    titulo: "Bolivia específica, no genérica",
    detalle:
      "IVA 13%, IT 3%, RCV, vencimientos por NIT, QR bancario, precios en bolivianos. No somos un software de afuera traducido: la contabilidad boliviana es el núcleo.",
  },
  {
    titulo: "Tus datos son tuyos",
    detalle:
      "Los exportás cuando quieras, no los vendemos y no entrenamos modelos de IA con ellos. Está en la política de privacidad, con nombre y apellido.",
  },
] as const;

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Nosotros", item: `${SITE_URL}/nosotros` },
      ],
    },
    {
      "@type": "AboutPage",
      name: "Quiénes somos — Onia",
      url: `${SITE_URL}/nosotros`,
      about: {
        "@type": "Organization",
        name: "Onia",
        legalName: "OniaAgency",
        url: `${SITE_URL}/`,
        email: CORREO_CONTACTO,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Santa Cruz de la Sierra",
          addressCountry: "BO",
        },
      },
    },
  ],
};

export default function Nosotros() {
  return (
    <>
      <JsonLd data={JSON_LD} />
      <Block surface="paper">
        <Entrada>
          <Kicker>Nosotros</Kicker>
          <h1 className={s.display}>
            Una empresa <em>boliviana</em> construyendo el sistema que Bolivia
            no tenía.
          </h1>
          <p className={s.lead}>
            Onia nace en Santa Cruz de la Sierra con una convicción simple: el
            dueño de un negocio boliviano merece la misma tecnología que una
            empresa grande — agentes que le preparan el trabajo —, en
            bolivianos y hablando su idioma. Somos OniaAgency, registrados en
            SEPREC y con NIT vigente, y el sistema ya corre en producción:
            entrás, lo usás {PRUEBA.dias} días con el plan {PRUEBA.planQueCorre}{" "}
            completo y sin dejar una tarjeta, y recién después decidís.
          </p>
        </Entrada>
      </Block>

      {/* Cuatro principios: fila de datos, no tarjetas — con cuatro, la grilla
          de tres deja un huérfano. */}
      <Block surface="paperDim" labelledBy="principios">
        <Reveal>
          <Kicker>Cómo trabajamos</Kicker>
          <h2 id="principios" className={s.h2}>
            Cuatro reglas, y se cumplen.
          </h2>
          <div className={s.rows}>
            {PRINCIPIOS.map((principio) => (
              <div key={principio.titulo} className={s.row}>
                <span className={s.rowName}>{principio.titulo}</span>
                <p className={s.rowText}>{principio.detalle}</p>
                <span />
              </div>
            ))}
          </div>
        </Reveal>
      </Block>

      <Block surface="green" labelledBy="hoy">
        <Reveal>
          <Kicker>Dónde estamos hoy</Kicker>
          <h2 id="hoy" className={s.h2} style={{ maxWidth: "22ch" }}>
            El sistema corre en producción.
          </h2>
          <p className={s.body} style={{ maxWidth: "48em" }}>
            {CUANTOS_RUBROS_CAPITAL} rubros disponibles — clínicas dentales,
            comercios, importadoras, estéticas y servicios profesionales. Lo probás tal como está hoy: {PRUEBA.dias} días con el
            plan {PRUEBA.planQueCorre} completo, sin tarjeta y sin contrato de
            permanencia. Si no
            te sirve, no pagás nada y tus datos te los llevás en CSV, con{" "}
            {RETENCION.diasParaExportar} días para hacerlo.
          </p>
          <div className={s.actions}>
            <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
            <Btn href={WA_URL_LANDING} variant="line" external>
              Hablar con nosotros
            </Btn>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
