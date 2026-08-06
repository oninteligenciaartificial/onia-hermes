"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Row, Shot } from "./shot";
import styles from "./landing.module.css";

const RUBROS = [
  { label: "Dental", estado: "andando" },
  { label: "Comercio", estado: "andando" },
  { label: "Importadora", estado: "andando" },
  { label: "Estética", estado: "andando" },
  { label: "Veterinaria", estado: "andando" },
  { label: "Servicios", estado: "andando" },
] as const;

type Card = {
  id: string;
  tone: "white" | "soft" | "green";
  /** Descripcion de la pantalla: pasa tal cual al alt cuando sea captura real. */
  aria: string;
  badge?: { texto: string; soon?: boolean };
  titulo: string;
  beneficio: string;
  visual: ReactNode;
};

/**
 * Las 7 funciones, patron Fanvue: el visual llena el marco y se corta abajo
 * (una pantalla real que sigue), y debajo va badge opcional + titulo de 2-4
 * palabras + UNA linea de beneficio.
 *
 * Los visuales son maquetas: son pantallas de adentro de una cuenta con datos,
 * y no se pueden capturar sin cuenta demo. Se cambian por capturas reales una
 * por una en cuanto exista esa cuenta — el marco y el texto no cambian.
 */
const CARDS: readonly Card[] = [
  {
    id: "agenda",
    tone: "white",
    aria: "Agenda del día en Onia Platform: tres citas con hora, paciente y duración, y un hueco de 45 minutos marcado.",
    titulo: "Agenda y fichas",
    beneficio: "Todo tu día en una sola pantalla.",
    visual: (
      <Shot title="Agenda · hoy">
        <Row time="09:00" name="Control · M. Áñez" dur="30 min" state="on" />
        <Row time="10:30" name="Ortodoncia · J. Rojas" dur="45 min" />
        <Row time="11:15" name="Hueco de 45 minutos" state="free" />
        <Row time="15:00" name="Limpieza · C. Vaca" dur="30 min" />
      </Shot>
    ),
  },
  {
    id: "agentes",
    tone: "soft",
    aria: "Cola de aprobación de Onia: el agente Recall redactó un recordatorio para un paciente que no vuelve hace meses y muestra los botones Aprobar y Descartar.",
    badge: { texto: "Nuevo" },
    titulo: "Agentes con IA",
    beneficio: "Trabajan de noche; nada sale sin tu OK.",
    visual: (
      <Shot title="Cola de aprobación" tag="1 pendiente">
        <div className={styles.approval}>
          <span className={styles.who}>Recall · P. Suárez, 6 meses sin control</span>
          <span className={styles.msg}>
            «Hola Pablo, hace tiempo no te vemos. ¿Agendamos tu control?»
          </span>
          <span className={styles.acts}>
            <span className={styles.ok}>Aprobar</span>
            <span className={styles.no}>Descartar</span>
          </span>
        </div>
      </Shot>
    ),
  },
  {
    id: "whatsapp",
    tone: "green",
    aria: "Conversación de WhatsApp: un cliente pregunta por disponibilidad y el chatbot de Onia le ofrece un horario concreto.",
    titulo: "Chatbot de WhatsApp",
    beneficio: "Responde y califica mientras vos atendés.",
    visual: (
      <Shot title="WhatsApp · consultas">
        <div className={styles.chat}>
          <span className={`${styles.bub} ${styles.bubThem}`}>
            ¿Tienen espacio esta semana?
          </span>
          <span className={`${styles.bub} ${styles.bubUs}`}>
            Sí — hoy 11:15. Te lo reservo.
          </span>
          <span className={`${styles.bub} ${styles.bubThem}`}>
            Perfecto, confirmo.
          </span>
          <span className={`${styles.bub} ${styles.bubUs}`}>
            Listo, quedó agendado.
          </span>
        </div>
      </Shot>
    ),
  },
  {
    id: "cobros",
    tone: "white",
    aria: "Cobro en caja: detalle de dos tratamientos, total en bolivianos, cobro con QR confirmado y la venta lista para facturar.",
    badge: { texto: "En trámite SIAT", soon: true },
    titulo: "Cobros y facturación",
    beneficio: "Cobrás con QR y la venta queda lista para el SIAT.",
    visual: (
      <Shot title="Cobro · caja">
        <div className={styles.doc}>
          <span className={styles.docLine}>
            <span>Limpieza dental</span>
            <b className={styles.mono}>Bs 250,00</b>
          </span>
          <span className={styles.docLine}>
            <span>Radiografía</span>
            <b className={styles.mono}>Bs 120,00</b>
          </span>
          <hr />
          <span className={styles.docLine}>
            <span>Total</span>
            <b className={styles.mono}>Bs 370,00</b>
          </span>
        </div>
        <Row name="Cobrado con QR" dur="14:02" state="on" />
        <Row name="Listo para facturar" state="free" />
      </Shot>
    ),
  },
  {
    id: "reserva",
    tone: "soft",
    aria: "Reserva pública de citas: el cliente ve los horarios libres del jueves y elige uno desde su teléfono.",
    titulo: "Reserva online",
    beneficio: "Tu cliente se agenda solo, un domingo a las once.",
    visual: (
      <Shot title="Reservar · jueves 6">
        <div className={styles.blocks}>
          <span>08:30</span>
          <span className={styles.blockOn}>09:15</span>
          <span>11:00</span>
          <span>16:30</span>
        </div>
        <Row name="Elegiste 09:15 · Control" dur="30 min" state="on" />
        <Row name="Confirmamos por WhatsApp" state="free" />
      </Shot>
    ),
  },
  {
    id: "web",
    tone: "white",
    aria: "Página web del negocio conectada al sistema, con el botón de reservar y los horarios que salen de la misma agenda.",
    titulo: "Página web",
    beneficio: "Conectada al sistema, no huérfana.",
    visual: (
      <Shot title="clinicaandina.bo">
        <span className={styles.webH}>Clínica Andina</span>
        <span className={styles.webP}>
          Odontología general y ortodoncia · Santa Cruz
        </span>
        <span className={styles.webCta}>Reservar hora</span>
        <Row name="Los horarios salen de tu agenda" state="free" />
      </Shot>
    ),
  },
  {
    id: "inventario",
    tone: "green",
    aria: "Inventario de insumos con existencias y un aviso de stock mínimo en anestesia.",
    titulo: "Inventario",
    beneficio: "Sabés qué falta antes de que falte.",
    visual: (
      <Shot title="Inventario" tag="1 aviso">
        <Row name="Guantes (caja)" dur="18" />
        <Row name="Resina A2" dur="7" state="on" />
        <Row name="Anestesia — bajo mínimo" dur="2" state="free" />
      </Shot>
    ),
  },
];

const TONES = {
  white: styles.fvisWhite,
  soft: styles.fvisSoft,
  green: styles.fvisGreen,
} as const;

function Arrow({ dir }: { dir: -1 | 1 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={dir === -1 ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

export function Features() {
  const band = useRef<HTMLDivElement>(null);
  const [rubro, setRubro] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = band.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const move = (dir: -1 | 1) => {
    const el = band.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(`.${styles.fcard}`);
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: step * dir, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section
      className={`${styles.section} ${styles.secVerde} ${styles.onDark}`}
      id="modulos"
    >
      <div className={styles.container}>
        <span className={styles.kicker}>Un sistema · tu rubro</span>
        <h2 className={styles.sectionTitle} style={{ marginTop: "0.5rem" }}>
          Módulos para clínicas, comercios, importadoras y profesionales.
        </h2>

        <div className={styles.rubroTabs} role="group" aria-label="Elegí tu rubro">
          {RUBROS.map((r, i) => (
            <button
              key={r.label}
              type="button"
              className={styles.rtab}
              aria-pressed={rubro === i}
              onClick={() => setRubro(i)}
            >
              {r.label} <small>{r.estado}</small>
            </button>
          ))}
        </div>
      </div>

      <div
        className={styles.band}
        ref={band}
        onScroll={sync}
        tabIndex={0}
        role="group"
        aria-label="Funciones de Onia Platform"
      >
        {CARDS.map((card) => (
          <article key={card.id} className={styles.fcard}>
            <div
              className={`${styles.fvis} ${TONES[card.tone]}`}
              role="img"
              aria-label={card.aria}
            >
              {card.visual}
            </div>
            <div className={styles.fmeta}>
              {card.badge ? (
                <span
                  className={`${styles.fbadge} ${
                    card.badge.soon ? styles.fbadgeSoon : ""
                  }`}
                >
                  {card.badge.texto}
                </span>
              ) : null}
              <h3>{card.titulo}</h3>
              <p>{card.beneficio}</p>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.fnav}>
        <button
          type="button"
          className={styles.fbtn}
          onClick={() => move(-1)}
          disabled={atStart}
          aria-label="Función anterior"
        >
          <Arrow dir={-1} />
        </button>
        <button
          type="button"
          className={styles.fbtn}
          onClick={() => move(1)}
          disabled={atEnd}
          aria-label="Función siguiente"
        >
          <Arrow dir={1} />
        </button>
      </div>

      <div className={styles.container}>
        <div className={styles.rail}>
          <p>
            Encendés lo que necesitás hoy y sumás el resto sin cambiar de sistema.
          </p>
          <a className={`${styles.btn} ${styles.btnPrimary}`} href="#precios">
            Probar gratis 14 días
          </a>
        </div>
      </div>
    </section>
  );
}
