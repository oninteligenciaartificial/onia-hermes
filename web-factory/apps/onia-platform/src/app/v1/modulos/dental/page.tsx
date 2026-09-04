import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PressableCta, Reveal, SplitTextReveal, StaggerGrid, StaggerItem } from "@/motion";
import { APP_URL, WA_URL_LANDING } from "@/lib/site";
import { bs, plan } from "@/lib/pricing";

const SITE_URL = "https://onia.com.bo";
const REGISTRO_URL = `${APP_URL}/register`;

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: "Software para clínicas dentales en Bolivia — Onia Platform",
  description:
    `Agenda, ficha del paciente con odontograma, recordatorios automáticos, caja, contabilidad con IVA/IT y agentes con IA que recuperan pacientes. Desde Bs ${bs(plan("basico").mensual)}/mes, 14 días gratis.`,
  alternates: { canonical: "/modulos/dental" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Software para clínicas dentales en Bolivia",
    description:
      "La agenda llena y los impuestos al día — sin cuaderno ni planillas. 14 días gratis.",
    url: "/modulos/dental",
  },
};

/**
 * /modulos/dental — la vertical profunda (patrón Holded /es/hosteleria y
 * Odoo /industries): habla el idioma del dueño de la clínica, dolor →
 * módulos → resultado → precio. Una vertical PROFUNDA vale más que cuatro
 * superficiales (orden del research); las demás siguen a este molde.
 */
const MODULOS = [
  {
    titulo: "Agenda y ficha del paciente",
    detalle:
      "El día completo en una pantalla: citas, historia clínica, odontograma y alertas médicas por severidad. La recepción ve la agenda; la historia clínica solo la ve quien vos autorizás.",
  },
  {
    titulo: "El agente que recupera pacientes",
    detalle:
      "Recall detecta quién no vuelve hace meses y te deja el mensaje redactado en una cola de aprobación. Vos tocás Aprobar — nada sale sin tu OK. Un paciente recuperado paga el mes del sistema.",
  },
  {
    titulo: "Reserva online",
    detalle:
      "Tu paciente elige horario desde el celular, un domingo a las once de la noche. Los horarios salen de tu misma agenda — sin dobles reservas.",
  },
  {
    titulo: "Caja y facturación",
    detalle:
      "Cobrás por QR y cada venta queda registrada y lista para facturar. Nuestro emisor ya está registrado ante el SIN y en trámite de homologación; mientras tanto, podés emitir por el portal gratuito del SIN sin re-tipear tus números.",
  },
  {
    titulo: "Contabilidad Bolivia",
    detalle:
      "IVA 13%, IT 3%, registro de compras y ventas (RCV) y el calendario de vencimientos según tu NIT. La carpeta que tu contador te pide, armada sola.",
  },
  {
    titulo: "Inventario de insumos",
    detalle:
      "Guantes, resinas, anestesia: sabés qué falta antes de que falte, con avisos de stock mínimo.",
  },
] as const;

const FAQ_DENTAL = [
  {
    q: "¿Sirve para un consultorio de un solo profesional?",
    a: `Sí — el plan ${plan("basico").nombre} (Bs ${bs(plan("basico").mensual)}/mes) está pensado exactamente para eso: agenda, pacientes y cobros ordenados, hasta 300 pacientes activos.`,
  },
  {
    q: "¿Puedo migrar mis pacientes desde Excel?",
    a: "Sí, hay importación por CSV con asistente de columnas. Y si tenés los datos en otro sistema, escribinos y te ayudamos con la migración.",
  },
  {
    q: "¿La historia clínica es privada?",
    a: "Cada rol ve lo suyo: la recepción agenda y cobra pero no ve historia clínica ni odontograma. Los datos de salud se tratan como categoría sensible — está escrito en nuestra política de privacidad.",
  },
] as const;

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Módulos", item: `${SITE_URL}/#modulos` },
        { "@type": "ListItem", position: 3, name: "Dental", item: `${SITE_URL}/modulos/dental` },
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "Onia Platform — módulo dental",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: `${SITE_URL}/modulos/dental`,
      description:
        "Software de gestión para clínicas dentales en Bolivia: agenda, odontograma, recordatorios, caja, contabilidad y agentes con IA.",
      offers: { "@type": "Offer", price: "320", priceCurrency: "BOB", category: "Suscripción mensual" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_DENTAL.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function ModuloDentalPage() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <section className="section">
          <div className="container">
            <Reveal>
              <p className="kicker">Módulo dental</p>
            </Reveal>
            {/* h1 SIN split: la promesa de la pagina se lee de una, no palabra
                por palabra (regla de la casa para titulares sobre el pliegue) */}
            <Reveal delay={0.06}>
              <h1 className="h2">
                La agenda llena y los impuestos al día — sin cuaderno ni
                planillas.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="lead">
                Onia configurada para tu clínica: pacientes, citas, odontograma,
                cobros y la contabilidad boliviana en una sola cuenta. Y un
                agente con IA que busca a los pacientes que dejaron de venir.
              </p>
            </Reveal>
            <Reveal delay={0.18} className="actions">
              <PressableCta>
                <a className="btn" href={REGISTRO_URL}>
                  Probar gratis 14 días
                </a>
              </PressableCta>
              <a className="btn btn-ghost" href="/precios">
                Ver precios
              </a>
            </Reveal>
          </div>
        </section>

        <section className="section section-tight">
          <div className="container">
            <SplitTextReveal
              as="h2"
              className="h2"
              text="Qué te queda funcionando."
            />
            <StaggerGrid className="card-grid">
              {MODULOS.map((modulo) => (
                <StaggerItem key={modulo.titulo} className="card">
                  <h3 className="h3">{modulo.titulo}</h3>
                  <p className="copy">{modulo.detalle}</p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>

        <section className="section section-deep">
          <div className="container">
            <SplitTextReveal
              as="h2"
              className="h2"
              text="Preguntas de colegas tuyos."
            />
            <StaggerGrid className="card-grid">
              {FAQ_DENTAL.map((item) => (
                <StaggerItem key={item.q} className="card">
                  <h3 className="h3">{item.q}</h3>
                  <p className="copy">{item.a}</p>
                </StaggerItem>
              ))}
            </StaggerGrid>
            <Reveal>
              <p className="lead" style={{ marginTop: "2rem" }}>
                ¿Te falta una respuesta?{" "}
                <a href={WA_URL_LANDING}>Escribinos por WhatsApp</a> — contesta
                una persona (o nuestro bot, que te lo dice de frente).
              </p>
            </Reveal>
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
