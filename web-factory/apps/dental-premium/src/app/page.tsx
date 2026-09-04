import { clinic, waLink } from "@/data/clinic";
import { Reveal } from "@/components/motion";
import { HeroScene } from "@/components/HeroScene";
import { LeadForm } from "@/components/LeadForm";
import "./site.css";

const CITA = waLink("Hola, vengo de la web y quiero agendar una cita.");

export default function Page() {
  return (
    <main>
      {/* NAV */}
      <header className="nav">
        <div className="wrap nav-inner">
          <span className="brand"><span className="brand-mark">{clinic.logo}</span>{clinic.nombre}</span>
          <a className="btn btn--solid nav-cta" href={CITA} target="_blank" rel="noreferrer">Agendar</a>
        </div>
      </header>

      {/* HERO — parallax GSAP, display serif enorme, superficie cálida de marca */}
      <HeroScene>
        <div className="hero-media" aria-hidden />
        <div className="hero-scrim" aria-hidden />
        {/* El hero va con alMontar: es lo único que ya está sobre el pliegue, así
            que su entrada no puede colgar de un scroll que no va a pasar. Ver el
            porqué medido en components/motion.tsx. */}
        <div className="wrap hero-content">
          <Reveal alMontar>
            <p className="eyebrow">{clinic.direccion} · Atención con turno</p>
          </Reveal>
          <Reveal alMontar delay={0.08}>
            <h1 className="hero-title">Tu próxima visita al dentista no tiene por qué <em>doler</em>.</h1>
          </Reveal>
          <Reveal alMontar delay={0.16}>
            <p className="hero-lede">{clinic.lede}</p>
          </Reveal>
          <Reveal alMontar delay={0.24}>
            <div className="actions">
              <a className="btn btn--solid" href={CITA} target="_blank" rel="noreferrer">Agendar por WhatsApp</a>
              <a className="btn btn--ghost" href="#servicios">Ver tratamientos</a>
            </div>
          </Reveal>
        </div>
      </HeroScene>

      {/* PROMESAS — banda de manifiesto en tinta */}
      <section className="strip">
        <div className="wrap strip-inner">
          {clinic.promesas.map((p) => (
            <span className="chip" key={p}>{p}</span>
          ))}
        </div>
      </section>

      {/* SERVICIOS — bento, primera celda destacada */}
      <section className="section" id="servicios">
        <div className="wrap">
          <Reveal><p className="kicker">Tratamientos</p></Reveal>
          <Reveal delay={0.05}><h2 className="h2">Todo lo que tu sonrisa necesita, en un lugar</h2></Reveal>
          <div className="bento">
            {clinic.servicios.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.06} className={i === 0 ? "card card--feat" : "card"}>
                <div className="card-in">
                  <h3 className="card-t">{s.t}</h3>
                  <p className="card-d">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESO — timeline numerada */}
      <section className="section section--dim">
        <div className="wrap">
          <Reveal><p className="kicker">Cómo funciona</p></Reveal>
          <Reveal delay={0.05}><h2 className="h2">De tu mensaje a tu cita, sin vueltas</h2></Reveal>
          <div className="timeline">
            {clinic.proceso.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.08} className="step">
                <span className="step-n">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="step-t">{p.t}</h3>
                <p className="step-d">{p.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="wrap faq-grid">
          <div>
            <Reveal><p className="kicker">Preguntas frecuentes</p></Reveal>
            <Reveal delay={0.05}><h2 className="h2">Lo que preguntan antes de venir</h2></Reveal>
          </div>
          <div className="faq-list">
            {clinic.faq.map((f) => (
              <Reveal key={f.q}>
                <details className="faq-item">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PEDIDO — la CONEXIÓN a Onia (form → /api/lead → sistema) */}
      <section className="section section--quote" id="pedir">
        <div className="wrap">
          <Reveal><p className="kicker">Pedí tu presupuesto por escrito</p></Reveal>
          <Reveal delay={0.05}>
            <h2 className="h2 quote-h">Contanos qué necesitás y te respondemos con el primer horario libre y el costo de la evaluación.</h2>
          </Reveal>
          <Reveal delay={0.1}><LeadForm /></Reveal>
        </div>
      </section>

      {/* CIERRE */}
      <section className="section closer">
        <div className="wrap">
          <Reveal><h2 className="closer-h">Tu próxima visita empieza con un mensaje.</h2></Reveal>
          <Reveal delay={0.08}>
            <div className="actions">
              <a className="btn btn--solid" href={CITA} target="_blank" rel="noreferrer">Agendar por WhatsApp</a>
              <a className="btn btn--ghost" href="#pedir">Pedir presupuesto</a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer-in">
          <div>
            <strong>{clinic.nombre}</strong>
            <p>{clinic.lede}</p>
          </div>
          <div className="footer-contact">
            <a href={CITA} target="_blank" rel="noreferrer">WhatsApp</a>
            <span>{clinic.direccion}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
