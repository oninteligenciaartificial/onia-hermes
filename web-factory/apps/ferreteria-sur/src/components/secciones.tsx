"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ferreteria, waLink } from "@/data/ferreteria";
import { Reveal } from "@/components/motion";
import { LeadForm } from "@/components/LeadForm";
import "./lead-form.css";

// ─────────────────────────────────────────────────────────────────────────────
// SECCIONES de Ferretería Sur. Todo el copy sale de src/data/ferreteria.ts;
// acá no se escribe una sola frase de negocio. Las clases son el contrato que
// ya define src/app/sections.css.
//
// Movimiento: SOLO transform y opacity, curva --ease-out = [0.16,1,0.3,1], y
// entradas de 0.6–0.9s (a 0.4s no se ven). Cada animación hace un trabajo:
//   hero      → parallax de la retícula: da profundidad al fondo, que es la marca
//   franja    → cinta que corre: las capacidades del local desfilan como en un cartel
//   categorías→ los estantes entran escalonados, como se llena una góndola
//   mostrador → las filas se listan de arriba a abajo, como se canta un pedido
//   cómo comprar → la LÍNEA se dibuja: la secuencia se explica sola
//   dónde     → el pin CAE sobre el croquis; el estado abierto/cerrado es real
//   pedido/faq→ entradas sobrias; el foco es el formulario
//
// Todo initial lleva opacity:0 a propósito: el <noscript> del layout revive
// cualquier bloque con opacity:0 si el JS no carga.
// ─────────────────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEW = { once: true, margin: "0px 0px -12% 0px" } as const;

// ═══ HERO · fondo en capas ═══════════════════════════════════════════════════
// La retícula y la pieza de fierro se mueven a distinta velocidad con el scroll.
// Solo transform (yPercent). Con reduced-motion no se registra el trigger: el
// fondo queda quieto y perfectamente legible.
const REGLA = Array.from({ length: 13 }, (_, i) => 40 + i * 30);

export function HeroFondo() {
  const root = useRef<HTMLDivElement | null>(null);

  // GSAP entra por import() DINÁMICO, no estático. Esta es la web de una
  // ferretería de barrio: la abre un cliente con datos móviles. Importado
  // arriba, `gsap` + `ScrollTrigger` viajaban en el bundle inicial de la home
  // (192 kB contra un presupuesto de 150) para una animación que ni siquiera
  // corre hasta después de montar, y que con reduced-motion no corre nunca.
  // Así el parallax sigue vivo — sólo llega en su propio chunk, después de que
  // la página ya se ve.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: { revert: () => void } | undefined;
    let cancelado = false;
    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      // El componente pudo desmontarse mientras bajaba el chunk: sin esta
      // guarda el trigger queda registrado sobre un nodo que ya no existe.
      if (cancelado) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const scroll = { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 };
        gsap.to(".hero-grid", { yPercent: 10, ease: "none", scrollTrigger: scroll });
        gsap.to(".hero-art", { yPercent: -22, ease: "none", scrollTrigger: scroll });
      }, root);
    })();
    return () => {
      cancelado = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div className="hero-fondo" ref={root} aria-hidden="true">
      <div className="hero-grid grid-bg" />
      {/* Tuerca, regla y una pieza al rojo. Geometría pura: ninguna imagen
          externa, se dibuja igual sin red. */}
      <svg className="hero-art" viewBox="0 0 420 420" fill="none" focusable="false">
        <g stroke="currentColor" strokeWidth="6">
          <polygon points="360,190 285,320 135,320 60,190 135,60 285,60" />
          <circle cx="210" cy="190" r="78" />
          <circle cx="210" cy="190" r="60" />
        </g>
        <g stroke="currentColor" strokeWidth="4">
          <line x1="24" y1="40" x2="24" y2="400" />
          {REGLA.map((y, i) => (
            <line key={y} x1="24" y1={y} x2={i % 3 === 0 ? 56 : 42} y2={y} />
          ))}
        </g>
        <g className="art-hot" stroke="currentColor" strokeWidth="10">
          <polygon points="378,340 354,382 306,382 282,340 306,298 354,298" />
        </g>
      </svg>
    </div>
  );
}

// ═══ FRANJA · cinta de capacidades ═══════════════════════════════════════════
// Dos pistas idénticas dentro del belt: la animación corre -50% y la costura
// cae exacta. La segunda es aria-hidden (el lector no repite la lista). Se
// pausa en hover/focus, y con reduced-motion queda fija en un estado legible.
function Pista({ oculta = false }: { oculta?: boolean }) {
  return (
    <div className="franja-track" aria-hidden={oculta || undefined}>
      {ferreteria.franja.map((f) => (
        <span className="franja-item" key={f}>
          {f}
        </span>
      ))}
    </div>
  );
}

export function Franja() {
  return (
    <div className="franja">
      <div className="franja-belt">
        <Pista />
        <Pista oculta />
      </div>
    </div>
  );
}

// ═══ CATEGORÍAS · tablero de mostrador ═══════════════════════════════════════
// Cada estante es un enlace vivo a WhatsApp con la consulta ya escrita: el
// tablero no es un catálogo muerto, es diez puertas de entrada al mismo canal.
export function Categorias() {
  return (
    <div className="board">
      {ferreteria.categorias.map((c, i) => (
        <Reveal key={c.cod} className="cat-slot" delay={Math.min(i, 6) * 0.05} y={18}>
          <a
            className="cat"
            href={waLink(`Hola, consulta de ${c.t.toLowerCase()}. Busco: `)}
            target="_blank"
            rel="noreferrer"
            aria-label={`Consultar por ${c.t} por WhatsApp`}
          >
            <span className="cat-code">
              <span>{c.cod}</span>
            </span>
            <span className="cat-in">
              <span className="cat-t">{c.t}</span>
              <span className="cat-d">{c.d}</span>
              <span className="cat-items">
                {c.items.map((it) => (
                  <span className="cat-item" key={it}>
                    {it}
                  </span>
                ))}
              </span>
            </span>
            <span className="cat-go">
              Consultar
              <span className="cat-arrow" aria-hidden="true">
                →
              </span>
            </span>
          </a>
        </Reveal>
      ))}
    </div>
  );
}

// ═══ MOSTRADOR · lo que no viene en caja ═════════════════════════════════════
export function Mostrador() {
  return (
    <dl className="serv">
      {ferreteria.mostrador.map((m, i) => (
        <Reveal key={m.t} className="serv-row" delay={i * 0.06} y={16}>
          <dt className="serv-t">
            <span className="serv-n">{String(i + 1).padStart(2, "0")}</span>
            {m.t}
          </dt>
          <dd className="serv-d">{m.d}</dd>
        </Reveal>
      ))}
    </dl>
  );
}

// ═══ CÓMO COMPRAR · la secuencia se dibuja ═══════════════════════════════════
// La línea crece de izquierda a derecha (scaleX, origen 0 50%) y los tres pasos
// aparecen detrás de ella, en orden. La animación ES la explicación.
export function Pasos() {
  const reduce = useReducedMotion();
  return (
    <div className="pasos">
      <motion.div
        className="pasos-line"
        aria-hidden="true"
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={VIEW}
        transition={{ duration: reduce ? 0 : 0.9, ease: EASE }}
      />
      {ferreteria.comoComprar.map((p, i) => (
        <Reveal key={p.t} className="paso" delay={0.18 + i * 0.16} y={20}>
          <span className="paso-n">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="paso-t">{p.t}</h3>
          <p className="paso-d">{p.d}</p>
        </Reveal>
      ))}
    </div>
  );
}

// ═══ DÓNDE Y CUÁNDO ══════════════════════════════════════════════════════════
// Estado abierto/cerrado REAL, calculado en la hora de Bolivia (no en la del
// visitante). Se resuelve después de montar: el primer render (servidor y
// cliente) dice lo mismo, así que no hay mismatch de hidratación ni salto de
// layout — el badge ya ocupa su lugar.
const ORDEN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const FILA: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 1, Sun: 2 };
const NOMBRE: Record<string, string> = {
  Mon: "el lunes",
  Tue: "el martes",
  Wed: "el miércoles",
  Thu: "el jueves",
  Fri: "el viernes",
  Sat: "el sábado",
  Sun: "el domingo",
};

type EstadoHoy = { abierto: boolean | null; texto: string; fila: number };
const NEUTRO: EstadoHoy = { abierto: null, texto: "Horario de atención", fila: -1 };

function calcularEstado(): EstadoHoy {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "America/La_Paz",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  ) as Record<string, string>;

  const dia = partes.weekday;
  const indice = ORDEN.indexOf(dia as (typeof ORDEN)[number]);
  if (indice < 0) return NEUTRO;

  const fila = FILA[dia];
  const hoy = ferreteria.horarios[fila];
  const ahora = `${partes.hour}:${partes.minute}`; // "HH:mm" se compara como texto

  if (hoy.abre && ahora >= hoy.abre && ahora < hoy.cierra) {
    return { abierto: true, texto: `Abierto ahora · cierra ${hoy.cierra}`, fila };
  }
  if (hoy.abre && ahora < hoy.abre) {
    return { abierto: false, texto: `Cerrado · hoy abre ${hoy.abre}`, fila };
  }
  for (let n = 1; n <= 7; n++) {
    const siguiente = ORDEN[(indice + n) % 7];
    const h = ferreteria.horarios[FILA[siguiente]];
    if (h.abre) {
      return { abierto: false, texto: `Cerrado · abre ${NOMBRE[siguiente]} ${h.abre}`, fila };
    }
  }
  return NEUTRO;
}

export function Donde() {
  const reduce = useReducedMotion();
  const [estado, setEstado] = useState<EstadoHoy>(NEUTRO);

  useEffect(() => {
    setEstado(calcularEstado());
  }, []);

  return (
    <div className="donde">
      <Reveal y={20}>
        <p className={`estado ${estado.abierto ? "estado--abierto" : "estado--cerrado"}`}>
          {estado.texto}
        </p>
        <dl className="hor">
          {ferreteria.horarios.map((h, i) => (
            <div className={`hor-row${i === estado.fila ? " is-hoy" : ""}`} key={h.dias}>
              <dt>
                {h.dias}
                {i === estado.fila && <span className="hor-hoy">Hoy</span>}
              </dt>
              <dd>{h.abre ? `${h.abre} – ${h.cierra}` : "Cerrado"}</dd>
            </div>
          ))}
        </dl>
        <p className="hor-nota">{ferreteria.horarioNota}</p>
      </Reveal>

      <Reveal delay={0.1} y={20}>
        {/* Croquis de anillos: Santa Cruz se explica por anillos concéntricos y
            avenidas radiales, así que el mapa del local es exactamente eso.
            SVG inline, sin proveedor de mapas ni request de red. */}
        <svg
          className="croquis"
          viewBox="0 0 460 336"
          role="img"
          aria-label={`Croquis de ubicación: ${ferreteria.nombre} está sobre la ${ferreteria.direccion}. ${ferreteria.referencia}.`}
        >
          <g className="cr-line">
            <path d="M160 310 A120 120 0 0 0 40 190" />
            <path d="M230 310 A190 190 0 0 0 40 120" />
            <path d="M300 310 A260 260 0 0 0 40 50" />
            <path d="M370 310 A330 330 0 0 0 40 -20" />
          </g>
          <path className="cr-via" d="M40 310 L346 53" />
          <text x="300" y="328" textAnchor="middle">
            3er anillo
          </text>
          <text x="382" y="328" textAnchor="middle">
            4to anillo
          </text>
          <text x="169" y="184" textAnchor="middle" transform="rotate(-40 169 184)">
            Av. Santos Dumont
          </text>
          {/* El pin se dibuja SIEMPRE: motion serializa la opacidad de un nodo
              SVG como ATRIBUTO (opacity="0"), y el <noscript> del layout solo
              revive lo que está en el style — con el JS caído el mapa se
              quedaba sin la única marca que importa. Lo que entra animado es
              el anillo que lo señala: si nunca corre, queda del tamaño del pin
              y no se pierde nada. Solo transform. */}
          <g className="cr-g">
            <motion.circle
              cx="266"
              cy="120"
              r="30"
              style={{ fill: "none", stroke: "var(--orange)", strokeWidth: 2 }}
              initial={{ scale: 0.35 }}
              whileInView={{ scale: 1 }}
              viewport={VIEW}
              transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.25, ease: EASE }}
            />
            <rect className="cr-pin" x="252" y="106" width="28" height="28" rx="3" transform="rotate(45 266 120)" />
            <text x="266" y="86" textAnchor="middle">
              Acá
            </text>
          </g>
        </svg>
      </Reveal>
    </div>
  );
}

// ═══ PEDIDO · la conexión a Onia ═════════════════════════════════════════════
export function Pedido() {
  return (
    <Reveal y={22}>
      <div className="pedido">
        <div className="pedido-main">
          <LeadForm />
        </div>
        <aside className="pedido-side">
          <h3 className="pedido-t">O escribinos directo</h3>
          <p className="pedido-d">
            Si preferís no llenar nada, mandá la foto del papel por WhatsApp y la cargamos
            nosotros. Es el mismo mostrador.
          </p>
          <div className="actions">
            <a
              className="btn btn--ghost"
              href={waLink("Hola, les paso mi lista por acá.")}
              target="_blank"
              rel="noreferrer"
            >
              Abrir WhatsApp
            </a>
          </div>
          <dl className="pedido-datos">
            <div>
              <dt>Teléfono</dt>
              <dd>{ferreteria.telefono}</dd>
            </div>
            {ferreteria.horarios.map((h) => (
              <div key={h.dias}>
                <dt>{h.dias}</dt>
                <dd>{h.abre ? `${h.abre} – ${h.cierra}` : "Cerrado"}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </Reveal>
  );
}

// ═══ FAQ ═════════════════════════════════════════════════════════════════════
export function Faq() {
  return (
    <div className="faq">
      {ferreteria.faq.map((f, i) => (
        <Reveal key={f.q} delay={i * 0.05} y={14}>
          <details className="faq-i">
            <summary className="faq-q">
              <span className="faq-qt">{f.q}</span>
              <span className="faq-x" aria-hidden="true" />
            </summary>
            <div className="faq-a">{f.a}</div>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
