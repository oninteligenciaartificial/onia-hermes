import type { Metadata } from "next";
import { PRUEBA, RETENCION, ALCANCE_CON_AGENDA, ALCANCE_CON_INVENTARIO } from "@/lib/pricing";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { APP_URL, WA_URL_LANDING } from "@/lib/site";
import { MEDIO_DE_PAGO } from "@/content/medio-de-pago";
import { PASO_CONFIRMAR_CORREO_IMPERATIVO } from "@/app/(sitio)/alta";

const SITE_URL = "https://onia.com.bo";
const REGISTRO_URL = `${APP_URL}/register`;

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: `Prueba gratis de ${PRUEBA.dias} días — Onia Platform, sin tarjeta`,
  // El paso del medio sale de `alta.ts`: esta description enumeraba el alta y el
  // uso del sistema como si fueran seguidos, y el producto exige confirmar el
  // correo en el medio. Es la copia que además se lee en el buscador.
  description:
    `Registrate en minutos, ${PASO_CONFIRMAR_CORREO_IMPERATIVO}, elegí tu rubro y usá el plan ${PRUEBA.planQueCorre} completo ${PRUEBA.dias} días: clientes, caja, contabilidad Bolivia y agentes con IA —más inventario ${ALCANCE_CON_INVENTARIO} y agenda ${ALCANCE_CON_AGENDA}—. Sin tarjeta y sin permanencia.`,
  alternates: { canonical: "/prueba-gratis" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: `Probá Onia Platform gratis ${PRUEBA.dias} días`,
    // Hermano del de `/empezar`: el preview se lee antes que la página, así que
    // el plan va nombrado acá también y sale de la fuente.
    description: `El plan ${PRUEBA.planQueCorre} completo, sin tarjeta. Elegís tu rubro y quedás andando en un día.`,
    url: "/prueba-gratis",
  },
};

/**
 * /prueba-gratis — la URL dedicada del trial (patrón Siigo /prueba-gratis/ y
 * Odoo /trial): el destino medible para ads, firmas de correo y links
 * externos. Corta a propósito: UNA decisión, cero desvíos.
 */
const RUBROS = [
  "Clínica dental",
  "Comercio / tienda",
  "Importadora",
  "Estética y spa",
  "Servicios profesionales",
] as const;

const PASOS = [
  {
    titulo: "Elegí tu rubro",
    detalle:
      "Onia se arma para el tuyo: pantallas, vocabulario y agentes a tu medida.",
  },
  {
    titulo: "Tu cuenta queda lista",
    detalle:
      // La promesa dice el camino que CORRE: la persona pega el enlace y el
      // motor lo lee (`traerHtml` cae a fetch nativo). Decía «le das el nombre
      // y el sistema busca», que es el paso (3) del orquestador y depende de
      // `SEARXNG_URL` — ausente en producción, así que devolvía el formulario
      // vacío. Ver capacidad-degradada.test.ts.
      "Sin instalación ni proyecto de meses. Pegás el enlace de tu web y el sistema lee la página y carga tus datos.",
  },
  {
    titulo: `Usalo de verdad ${PRUEBA.dias} días`,
    // El medio de pago lo dice `@/content/medio-de-pago`, no esta pantalla: acá
    // decía «pagás por QR» y no existe ningún QR.
    detalle: `Todo encendido: caja, contabilidad, la cola de agentes, el inventario ${ALCANCE_CON_INVENTARIO} y la agenda ${ALCANCE_CON_AGENDA}. ${MEDIO_DE_PAGO.siTeSirve}`,
  },
] as const;

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Prueba gratis", item: `${SITE_URL}/prueba-gratis` },
      ],
    },
    {
      "@type": "Offer",
      name: `Prueba gratis de ${PRUEBA.dias} días de Onia Platform`,
      price: "0",
      priceCurrency: "BOB",
      url: `${SITE_URL}/prueba-gratis`,
      availability: "https://schema.org/InStock",
    },
  ],
};

export default function PruebaGratisPage() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <section className="section">
          <div className="container">
            <p className="kicker">Prueba gratis</p>
            <h1 className="h2">
              {PRUEBA.dias} días con el plan {PRUEBA.planQueCorre} completo. Sin
              tarjeta.
            </h1>
            {/* Acá decía «con todos los módulos encendidos», y es falso: la
                prueba corre con PRUEBA.planQueCorre, sin el chatbot de
                WhatsApp ni el segundo administrador. El h1 de arriba ya nombra
                el plan, así que repetirlo sería decir dos veces lo mismo: lo
                que queda es la promesa que el alta SÍ cumple. */}
            {/* La ventana del export se nombra acá por lo mismo que en
                `(sitio)/empezar`: §8 la acota a RETENCION.diasParaExportar días
                desde la terminación, y esta oración habla justamente de irse.
                Son hermanas: arreglar una sola es como nació el defecto. */}
            <p className="lead">
              No es una demo recortada: es tu cuenta real, con tu rubro ya
              configurado. Si al final no te sirve, no pagás nada — y tus datos
              te los llevás en CSV, con {RETENCION.diasParaExportar} días para
              hacerlo.
            </p>
            <p style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a className="btn" href={REGISTRO_URL}>
                Crear mi cuenta gratis
              </a>
              <a className="btn btn-ghost" href={WA_URL_LANDING}>
                Prefiero preguntar por WhatsApp
              </a>
            </p>
          </div>
        </section>

        <section className="section section-tight">
          <div className="container">
            <h2 className="h3">
              Así se ve el camino:
            </h2>
            <ol style={{ marginTop: "1.25rem", display: "grid", gap: "1rem", paddingLeft: "1.25rem" }}>
              {PASOS.map((paso) => (
                <li key={paso.titulo} className="lead" style={{ maxWidth: "46rem" }}>
                  <strong>{paso.titulo}.</strong> {paso.detalle}
                </li>
              ))}
            </ol>
            <p className="lead" style={{ marginTop: "1.5rem" }}>
              Rubros disponibles hoy:{" "}
              {RUBROS.map((rubro, i) => (
                <span key={rubro}>
                  <span className="badge badge-on">{rubro}</span>
                  {i < RUBROS.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
            <p className="lead" style={{ marginTop: "1.5rem" }}>
              ¿Querés ver montos antes de entrar? <a href="/precios">Los precios están publicados</a>{" "}
              — en bolivianos y con la letra chica a la vista.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
    </>
  );
}
