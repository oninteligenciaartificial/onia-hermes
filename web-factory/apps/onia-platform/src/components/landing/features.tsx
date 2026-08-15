"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Row, Shot } from "./shot";
import { SplitTextReveal, StaggerGrid, StaggerItem } from "@/motion";
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
 * Escena — los pasos de la pantalla entran EN ORDEN cada vez que la tarjeta
 * aparece. El visual MUESTRA lo que el modulo hace (la conversacion avanza,
 * el cobro se completa) en vez de decorar: el orden ES la explicacion.
 *
 * Reusa el stagger del kit (@/motion), no un sistema de animacion nuevo: solo
 * transform + opacity, y con prefers-reduced-motion el MotionConfig del
 * provider apaga el movimiento. `repetir` porque el carrusel avanza solo y una
 * escena `once` quedaria muerta para quien mira despues.
 */
function Escena({
  children,
  className = styles.seq,
  paso = 0.45,
}: {
  children: ReactNode;
  className?: string;
  /** Segundos entre un paso y el siguiente. */
  paso?: number;
}) {
  return (
    <StaggerGrid className={className} stagger={paso} repetir>
      {children}
    </StaggerGrid>
  );
}

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
        {/* el día se llena hora por hora, y el hueco aparece entre dos citas */}
        <Escena paso={0.35}>
          <StaggerItem>
            <Row time="09:00" name="Control · M. Áñez" dur="30 min" state="on" />
          </StaggerItem>
          <StaggerItem>
            <Row time="10:30" name="Ortodoncia · J. Rojas" dur="45 min" />
          </StaggerItem>
          <StaggerItem>
            <Row time="11:15" name="Hueco de 45 minutos" state="free" />
          </StaggerItem>
          <StaggerItem>
            <Row time="15:00" name="Limpieza · C. Vaca" dur="30 min" />
          </StaggerItem>
        </Escena>
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
        {/* el agente detecta, redacta, y RECIÉN ENTONCES pide tu OK: los
            botones entrando último son el human-in-the-loop, dibujado */}
        <Escena className={styles.approval} paso={0.6}>
          <StaggerItem as="span" className={styles.who}>
            Recall · P. Suárez, 6 meses sin control
          </StaggerItem>
          <StaggerItem as="span" className={styles.msg}>
            «Hola Pablo, hace tiempo no te vemos. ¿Agendamos tu control?»
          </StaggerItem>
          <StaggerItem as="span" className={styles.acts}>
            <span className={styles.ok}>Aprobar</span>
            <span className={styles.no}>Descartar</span>
          </StaggerItem>
        </Escena>
      </Shot>
    ),
  },
  {
    id: "whatsapp",
    tone: "green",
    aria: "Conversación de WhatsApp: un cliente pregunta por disponibilidad y el chatbot de Onia le ofrece un horario concreto.",
    titulo: "Chatbot de WhatsApp",
    beneficio:
      "Responde y califica mientras vos atendés. Se contrata aparte, desde Bs 200/mes.",
    visual: (
      <Shot title="WhatsApp · consultas">
        {/* la conversación AVANZA: mensaje por mensaje, alternando lados,
            hasta que la cita queda cerrada sin que nadie del negocio conteste */}
        <Escena className={styles.chat} paso={0.65}>
          <StaggerItem as="span" className={`${styles.bub} ${styles.bubThem}`}>
            ¿Tienen espacio esta semana?
          </StaggerItem>
          <StaggerItem as="span" className={`${styles.bub} ${styles.bubUs}`}>
            Sí — hoy 11:15. Te lo reservo.
          </StaggerItem>
          <StaggerItem as="span" className={`${styles.bub} ${styles.bubThem}`}>
            Perfecto, confirmo.
          </StaggerItem>
          <StaggerItem as="span" className={`${styles.bub} ${styles.bubUs}`}>
            Listo, quedó agendado.
          </StaggerItem>
        </Escena>
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
        {/* el pago SE COMPLETA en orden: los ítems entran, se suma el total,
            entra el cobro por QR y recién ahí la venta queda lista */}
        <Escena paso={0.4}>
          <StaggerItem as="span" className={styles.docLine}>
            <span>Limpieza dental</span>
            <b className={styles.mono}>Bs 250,00</b>
          </StaggerItem>
          <StaggerItem as="span" className={styles.docLine}>
            <span>Radiografía</span>
            <b className={styles.mono}>Bs 120,00</b>
          </StaggerItem>
          <hr />
          <StaggerItem as="span" className={styles.docLine}>
            <span>Total</span>
            <b className={styles.mono}>Bs 370,00</b>
          </StaggerItem>
          <StaggerItem>
            <Row name="Cobrado con QR" dur="14:02" state="on" />
          </StaggerItem>
          <StaggerItem>
            <Row name="Listo para facturar" state="free" />
          </StaggerItem>
        </Escena>
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
        {/* aparecen los horarios libres, el cliente toca uno y la reserva se
            confirma: el flujo entero sin que el negocio levante el teléfono */}
        <Escena paso={0.5}>
          <StaggerGrid className={styles.blocks} stagger={0.12} repetir>
            <StaggerItem as="span">08:30</StaggerItem>
            <StaggerItem as="span" className={styles.blockOn}>
              09:15
            </StaggerItem>
            <StaggerItem as="span">11:00</StaggerItem>
            <StaggerItem as="span">16:30</StaggerItem>
          </StaggerGrid>
          <StaggerItem>
            <Row name="Elegiste 09:15 · Control" dur="30 min" state="on" />
          </StaggerItem>
          <StaggerItem>
            <Row name="Confirmamos por WhatsApp" state="free" />
          </StaggerItem>
        </Escena>
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
        {/* la web se arma y termina en el botón de reservar: el último paso
            aclara de dónde salen los horarios */}
        <Escena paso={0.4}>
          <StaggerItem as="span" className={styles.webH}>
            Clínica Andina
          </StaggerItem>
          <StaggerItem as="span" className={styles.webP}>
            Odontología general y ortodoncia · Santa Cruz
          </StaggerItem>
          <StaggerItem as="span" className={styles.webCta}>
            Reservar hora
          </StaggerItem>
          <StaggerItem>
            <Row name="Los horarios salen de tu agenda" state="free" />
          </StaggerItem>
        </Escena>
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
        {/* el stock baja renglón a renglón y el aviso llega último: ese es el
            momento útil, no la lista */}
        <Escena paso={0.45}>
          <StaggerItem>
            <Row name="Guantes (caja)" dur="18" />
          </StaggerItem>
          <StaggerItem>
            <Row name="Resina A2" dur="7" state="on" />
          </StaggerItem>
          <StaggerItem>
            <Row name="Anestesia — bajo mínimo" dur="2" state="free" />
          </StaggerItem>
        </Escena>
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
  const [idx, setIdx] = useState(0);
  // Auto-avance: pausado mientras el usuario mira/toca, y solo con la banda
  // visible en pantalla. prefers-reduced-motion lo apaga del todo.
  const [paused, setPaused] = useState(false);
  const [enPantalla, setEnPantalla] = useState(false);

  const cardStep = useCallback(() => {
    const el = band.current;
    if (!el) return 0;
    const card = el.querySelector<HTMLElement>(`.${styles.fcard}`);
    return card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
  }, []);

  const sync = useCallback(() => {
    const el = band.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2);
    const step = cardStep();
    if (step > 0) {
      setIdx(Math.min(CARDS.length - 1, Math.round(el.scrollLeft / step)));
    }
  }, [cardStep]);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  useEffect(() => {
    const el = band.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setEnPantalla(entry.isIntersecting),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const move = (dir: -1 | 1) => {
    const el = band.current;
    if (!el) return;
    const step = cardStep();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: step * dir, behavior: reduced ? "auto" : "smooth" });
  };

  const irA = (i: number) => {
    const el = band.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: cardStep() * i, behavior: reduced ? "auto" : "smooth" });
  };

  // El carrusel se mueve solo: una card cada 4,5s, vuelve al inicio al llegar
  // al final. Se pausa con hover/touch/foco y con la pestana oculta.
  useEffect(() => {
    if (paused || !enPantalla) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const el = band.current;
      if (!el) return;
      const alFinal = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2;
      if (alFinal) el.scrollTo({ left: 0, behavior: "smooth" });
      else move(1);
    }, 4500);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, enPantalla]);

  return (
    <section
      className={`${styles.section} ${styles.secVerde} ${styles.onDark}`}
      id="modulos"
    >
      <div className={styles.container}>
        <span className={styles.kicker}>Un sistema · tu rubro</span>
        <div style={{ marginTop: "0.5rem" }}>
          <SplitTextReveal
            as="h2"
            className={styles.sectionTitle}
            text="Módulos para clínicas, comercios, importadoras y profesionales."
          />
        </div>

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
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
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
        <div className={styles.fdots} role="tablist" aria-label="Ir a una función">
          {CARDS.map((card, i) => (
            <button
              key={card.id}
              type="button"
              role="tab"
              aria-selected={idx === i}
              aria-label={`${card.titulo} (${i + 1} de ${CARDS.length})`}
              className={`${styles.fdot}${idx === i ? ` ${styles.fdotOn}` : ""}`}
              onClick={() => irA(i)}
            />
          ))}
        </div>
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
