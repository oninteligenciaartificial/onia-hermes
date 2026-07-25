import { APP_URL } from "@/lib/constants";
import { CtaWhatsApp } from "./cta-whatsapp";
import { ScreenshotFrame } from "./screenshot-frame";

export function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-heading">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="chip">Software de gestión dental · Bolivia</p>
          <h1 id="hero-heading">
            Tu agenda llena no sirve si la silla queda vacía.
          </h1>
          <p className="hero-sub">
            DentalGest maneja tu clínica dental completa: agenda, historias
            clínicas, facturación SIAT y un agente que reprograma a los
            pacientes que te fallan — todo por WhatsApp, sin planillas ni
            cuaderno.
          </p>
          <div className="cta-row">
            <CtaWhatsApp label="Quiero una demo por WhatsApp" />
            <a href={APP_URL} className="btn btn-ghost">
              Entrar a la app
            </a>
          </div>
          <p className="microcopy">
            Precios de lanzamiento · Implementación y migración incluidas
          </p>
        </div>
        <div className="hero-visual">
          <ScreenshotFrame title="DentalGest — Agenda" priority />
          <div className="wa-chip">
            <span className="wa-check" aria-hidden="true">
              ✓
            </span>
            <p>Reprogramado: María P. pasó del jue 15:00 al vie 10:30</p>
          </div>
        </div>
      </div>
    </section>
  );
}
