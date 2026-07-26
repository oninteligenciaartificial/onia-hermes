import { APP_URL } from "@/lib/constants";
import { CtaWhatsApp } from "./cta-whatsapp";

export function CtaFinal() {
  return (
    <section className="cta-final" aria-labelledby="cta-final-heading">
      <div className="container">
        <h2 id="cta-final-heading" data-reveal>
          ¿Cuántos pacientes te fallaron este mes sin avisar?
        </h2>
        <p data-reveal>
          Hacé la cuenta a Bs 300 el ajuste. DentalGest cuesta menos que dos de
          esas ausencias.
        </p>
        <div className="cta-row" data-reveal>
          <CtaWhatsApp label="Quiero una demo por WhatsApp" variant="paper" />
          <a href={APP_URL} className="btn btn-ghost">
            Entrar a la app
          </a>
        </div>
      </div>
    </section>
  );
}
