import { CtaWhatsApp } from "./cta-whatsapp";

export function Siat() {
  return (
    <section className="siat" aria-labelledby="siat-heading">
      <div className="container">
        <div className="siat-inner">
          <p className="chip chip-clay mono" data-reveal>
            30-SEP-2026 · fin del plazo
          </p>
          <h2 id="siat-heading" data-reveal>
            Desde el 1 de octubre, solo se factura en línea
          </h2>
          <p className="siat-texto" data-reveal>
            El SIN fijó el 30 de septiembre de 2026 como plazo para pasarse a
            la facturación en línea. Dejalo resuelto antes — no en la última
            semana, con todos haciendo el mismo trámite.
          </p>
          <div className="siat-disclaimer" data-reveal>
            Hablando claro: podés cumplir gratis con el Portal Web del SIN,
            tipeando cada factura a mano en su página. DentalGest existe para
            que no tengas que hacerlo — la factura sale sola, con los datos que
            ya cargaste una vez.
          </div>
          <div data-reveal>
            <CtaWhatsApp label="Dejalo resuelto — hablemos por WhatsApp" />
          </div>
        </div>
      </div>
    </section>
  );
}
