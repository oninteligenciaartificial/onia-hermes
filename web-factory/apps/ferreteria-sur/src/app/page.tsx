import { ferreteria, waLink } from "@/data/ferreteria";
import { Reveal } from "@/components/motion";
import "./site.css";

// ─────────────────────────────────────────────────────────────────────────────
// ESQUELETO. Fija el orden y el armazón de cada sección; el relleno (piezas de
// categorías, mostrador, pasos, panel de horarios, formulario y FAQ) lo escribe
// el agente de secciones dentro de los <section> marcados.
//
// Reglas que NO se tocan al rellenar:
//   · Solo se anima transform y opacity. Reveal ya respeta reduced-motion.
//   · Prohibido nombrar obra ("próximamente", "beta", "en construcción").
//   · Prohibido inventar prueba social: cero testimonios, logos, cifras, SLA.
//   · Los precios que puedan aparecer son de PRODUCTO de ferretería, nunca de
//     software.
//   · Sin imágenes externas: todo asset se resuelve con CSS o SVG inline.
// ─────────────────────────────────────────────────────────────────────────────

const LISTA = waLink("Hola, les paso mi lista para saber si tienen stock.");

export default function Page() {
  return (
    <main>
      {/* ═══ 01 · NAV — barra utilitaria sticky, filete de 2px, CTA a WhatsApp ═══ */}
      <header className="nav">
        <div className="wrap nav-inner">
          <span className="brand">
            <span className="brand-mark" aria-hidden>{ferreteria.marca}</span>
            {ferreteria.nombre}
          </span>
          <span className="nav-meta tag">
            {ferreteria.zona} · {ferreteria.ciudad}
          </span>
          <a className="btn btn--solid" href={LISTA} target="_blank" rel="noreferrer">
            Pasar mi lista
          </a>
        </div>
      </header>

      {/* ═══ 02 · HERO — split asimétrico sobre retícula visible.
          Izquierda: titular mega en Archivo Black. Derecha: ficha de datos duros
          en mono. RELLENO: parallax GSAP suave de la retícula (solo transform)
          y una pieza gráfica de herramienta en SVG inline. ═══ */}
      <section className="hero grid-bg">
        <div className="wrap hero-inner">
          <div>
            <Reveal>
              <p className="kicker">{ferreteria.direccion} · {ferreteria.zona}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="hero-title">
                Si lo usás para <em>arreglar</em> algo, acá está
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="hero-lede">{ferreteria.lede}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="actions">
                <a className="btn btn--solid" href={LISTA} target="_blank" rel="noreferrer">
                  Pasar mi lista
                </a>
                <a className="btn btn--ghost" href="#categorias">Ver qué hay</a>
              </div>
            </Reveal>
          </div>

          {/* Ficha: horario de hoy, dirección, cómo se paga. RELLENO: estado
              abierto/cerrado calculado en cliente y detalle de pago. */}
          <Reveal delay={0.28}>
            <dl className="spec">
              {ferreteria.horarios.map((h) => (
                <div className="spec-row" key={h.dias}>
                  <dt>{h.dias}</dt>
                  <dd>{h.abre ? `${h.abre} – ${h.cierra}` : "Cerrado"}</dd>
                </div>
              ))}
              <div className="spec-row">
                <dt>Dónde</dt>
                <dd>{ferreteria.direccion}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ═══ 03 · FRANJA — cinta naranja de capacidades del local.
          RELLENO: desplazamiento infinito por transform, duplicando la pista y
          con animación apagada bajo prefers-reduced-motion. ═══ */}
      <div className="franja">
        <div className="franja-track">
          {ferreteria.franja.map((f) => (
            <span className="franja-item" key={f}>{f}</span>
          ))}
        </div>
      </div>

      {/* ═══ 04 · CATEGORÍAS — tablero de mostrador.
          RELLENO: retícula con filete COMPARTIDO (nada de tarjetas sueltas y
          uniformes), código de estante en mono a la izquierda, primera celda a
          doble ancho, lista de items al abrir/hover. ═══ */}
      <section className="section" id="categorias">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <Reveal><p className="kicker">Góndola</p></Reveal>
              <Reveal delay={0.05}><h2 className="h2">Diez estantes y el que falta lo conseguimos</h2></Reveal>
            </div>
            <Reveal delay={0.1}>
              <p className="sec-note">
                {ferreteria.categorias.length} categorías en piso. Si buscás una medida rara,
                mandá la foto de la pieza vieja y la igualamos.
              </p>
            </Reveal>
          </div>
          {/* ► tablero de categorías */}
        </div>
      </section>

      {/* ═══ 05 · MOSTRADOR — lo que se hace en el local, no lo que se vende.
          RELLENO: lista con numeración mono y filete horizontal, sin cajas. ═══ */}
      <section className="section section--dim" id="mostrador">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <Reveal><p className="kicker">En el mostrador</p></Reveal>
              <Reveal delay={0.05}><h2 className="h2">Lo que no viene en caja</h2></Reveal>
            </div>
          </div>
          {/* ► servicios de mostrador */}
        </div>
      </section>

      {/* ═══ 06 · CÓMO COMPRAR — tres pasos. El circuito que el sitio provoca.
          RELLENO: numeración enorme en display, línea que conecta los pasos. ═══ */}
      <section className="section" id="como-comprar">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <Reveal><p className="kicker">Cómo se compra</p></Reveal>
              <Reveal delay={0.05}><h2 className="h2">Mandás la lista, te confirmamos, retirás</h2></Reveal>
            </div>
          </div>
          {/* ► tres pasos */}
        </div>
      </section>

      {/* ═══ 07 · HORARIOS Y UBICACIÓN — panel de acero (.on-steel).
          RELLENO: tabla de horarios en mono, referencia del lugar y croquis
          esquemático en SVG inline (anillos + avenida). Sin mapas externos. ═══ */}
      <section className="section section--steel on-steel" id="donde">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <Reveal><p className="kicker">Dónde y cuándo</p></Reveal>
              <Reveal delay={0.05}><h2 className="h2">{ferreteria.direccion}</h2></Reveal>
            </div>
            <Reveal delay={0.1}><p className="sec-note">{ferreteria.referencia}</p></Reveal>
          </div>
          {/* ► tabla de horarios + croquis */}
        </div>
      </section>

      {/* ═══ 08 · PEDIDO — la CONEXIÓN a Onia.
          RELLENO: <LeadForm /> (cliente, autosave en localStorage) que postea a
          /api/lead. Esos dos archivos son de los otros agentes. ═══ */}
      <section className="section" id="pedido">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <Reveal><p className="kicker">Pasá tu lista</p></Reveal>
              <Reveal delay={0.05}>
                <h2 className="h2">Escribí lo que necesitás y te decimos qué hay</h2>
              </Reveal>
            </div>
          </div>
          {/* ► formulario de pedido */}
        </div>
      </section>

      {/* ═══ 09 · FAQ — dos columnas, <details> con filete. ═══ */}
      <section className="section section--dim" id="preguntas">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <Reveal><p className="kicker">Preguntas</p></Reveal>
              <Reveal delay={0.05}><h2 className="h2">Lo que preguntan por WhatsApp</h2></Reveal>
            </div>
          </div>
          {/* ► lista de preguntas */}
        </div>
      </section>

      {/* ═══ 10 · CIERRE ═══ */}
      <section className="closer">
        <div className="wrap">
          <Reveal>
            <h2 className="closer-h">Traé la medida. Nosotros ponemos el resto.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="actions">
              <a className="btn btn--solid" href={LISTA} target="_blank" rel="noreferrer">
                Pasar mi lista
              </a>
              <a className="btn btn--ghost" href="#donde">Cómo llegar</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 11 · FOOTER — acero, datos de contacto y horario. ═══ */}
      <footer className="footer on-steel">
        <div className="wrap">
          <div className="footer-in">
            <div>
              <p className="footer-brand">{ferreteria.nombre}</p>
              <p className="sec-note">{ferreteria.tagline}.</p>
            </div>
            <div className="footer-col">
              <span className="tag">Contacto</span>
              <a href={LISTA} target="_blank" rel="noreferrer">WhatsApp</a>
              <span>{ferreteria.telefono}</span>
            </div>
            <div className="footer-col">
              <span className="tag">Dónde</span>
              <span>{ferreteria.direccion}</span>
              <span>{ferreteria.zona}, {ferreteria.ciudad}</span>
            </div>
          </div>
          <p className="footer-legal">
            {ferreteria.nombre} · {ferreteria.ciudad}, Bolivia
          </p>
        </div>
      </footer>
    </main>
  );
}
