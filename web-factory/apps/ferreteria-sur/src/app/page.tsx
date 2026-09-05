import { ferreteria, waLink } from "@/data/ferreteria";
import { Reveal } from "@/components/motion";
import {
  Categorias,
  Donde,
  Faq,
  Franja,
  HeroFondo,
  Mostrador,
  Pasos,
  Pedido,
} from "@/components/secciones";
import "./site.css";
import "./sections.css";

// ─────────────────────────────────────────────────────────────────────────────
// Página completa. El armazón vive en site.css, las secciones en sections.css y
// el markup de cada una en components/secciones.tsx. Acá solo va el orden, las
// cabeceras y los CTA.
//
// Reglas que NO se tocan:
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
          en mono. La retícula y la pieza de fierro viven en <HeroFondo /> y se
          mueven con parallax GSAP (solo transform). ═══ */}
      <section className="hero">
        <HeroFondo />
        <div className="wrap hero-inner">
          {/* El hero va con alMontar: es lo único que ya está sobre el pliegue,
              así que su entrada no puede colgar de un scroll que no va a pasar.
              Ver el porqué medido en components/motion.tsx. */}
          <div>
            <Reveal alMontar>
              <p className="kicker">{ferreteria.direccion} · {ferreteria.zona}</p>
            </Reveal>
            <Reveal alMontar delay={0.06}>
              <h1 className="hero-title">
                Si lo usás para <em>arreglar</em> algo, acá está
              </h1>
            </Reveal>
            <Reveal alMontar delay={0.14}>
              <p className="hero-lede">{ferreteria.lede}</p>
            </Reveal>
            <Reveal alMontar delay={0.2}>
              <div className="actions">
                <a className="btn btn--solid" href={LISTA} target="_blank" rel="noreferrer">
                  Pasar mi lista
                </a>
                <a className="btn btn--ghost" href="#categorias">Ver qué hay</a>
              </div>
            </Reveal>
          </div>

          {/* Ficha de datos duros. El estado abierto/cerrado en vivo va en la
              sección "Dónde y cuándo", calculado en hora de Bolivia. */}
          <Reveal alMontar delay={0.28}>
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

      {/* ═══ 03 · FRANJA — cinta naranja de capacidades del local, en marcha
          continua por transform. Se pausa en hover/focus. ═══ */}
      <Franja />

      {/* ═══ 04 · CATEGORÍAS — tablero de mostrador: filete compartido, filas
          de anchos desparejos y cada estante enlazado a WhatsApp. ═══ */}
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
          <Categorias />
        </div>
      </section>

      {/* ═══ 05 · MOSTRADOR — lo que se hace en el local, no lo que se vende.
          Lista numerada en mono con filete horizontal, sin cajas. ═══ */}
      <section className="section section--dim" id="mostrador">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <Reveal><p className="kicker">En el mostrador</p></Reveal>
              <Reveal delay={0.05}><h2 className="h2">Lo que no viene en caja</h2></Reveal>
            </div>
            <Reveal delay={0.1}>
              <p className="sec-note">
                {ferreteria.mostrador.length} cosas que se resuelven en el mostrador y por
                las que la gente cruza la ciudad igual que por el material.
              </p>
            </Reveal>
          </div>
          <Mostrador />
        </div>
      </section>

      {/* ═══ 06 · CÓMO COMPRAR — el circuito que el sitio provoca. La línea que
          une los pasos se DIBUJA al entrar: la animación es la explicación. ═══ */}
      <section className="section" id="como-comprar">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <Reveal><p className="kicker">Cómo se compra</p></Reveal>
              <Reveal delay={0.05}><h2 className="h2">Mandás la lista, te confirmamos, retirás</h2></Reveal>
            </div>
            <Reveal delay={0.1}>
              <p className="sec-note">
                No hace falta cuenta, ni registro, ni bajar nada. Es el mismo mostrador,
                por escrito.
              </p>
            </Reveal>
          </div>
          <Pasos />
        </div>
      </section>

      {/* ═══ 07 · HORARIOS Y UBICACIÓN — panel de acero (.on-steel). Estado
          abierto/cerrado en hora de Bolivia y croquis de anillos en SVG
          inline. Sin proveedor de mapas: renderiza sin red. ═══ */}
      <section className="section section--steel on-steel" id="donde">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <Reveal><p className="kicker">Dónde y cuándo</p></Reveal>
              <Reveal delay={0.05}><h2 className="h2">{ferreteria.direccion}</h2></Reveal>
            </div>
            <Reveal delay={0.1}><p className="sec-note">{ferreteria.referencia}</p></Reveal>
          </div>
          <Donde />
        </div>
      </section>

      {/* ═══ 08 · PEDIDO — la CONEXIÓN a Onia. <LeadForm /> postea a /api/lead,
          que reenvía a Onia Platform desde el servidor. ═══ */}
      <section className="section" id="pedido">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <Reveal><p className="kicker">Pasá tu lista</p></Reveal>
              <Reveal delay={0.05}>
                <h2 className="h2">Escribí lo que necesitás y te decimos qué hay</h2>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <p className="sec-note">
                Copiá la lista tal como la tenés anotada, con marcas y medidas. Cuanto más
                específica, menos vueltas.
              </p>
            </Reveal>
          </div>
          <Pedido />
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
            <Reveal delay={0.1}>
              <p className="sec-note">
                Si la tuya no está acá, escribí igual: se contesta la misma persona que
                atiende el mostrador.
              </p>
            </Reveal>
          </div>
          <Faq />
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
