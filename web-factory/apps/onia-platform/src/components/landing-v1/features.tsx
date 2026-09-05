import type { ReactNode } from "react";
import { Row, Shot } from "./shot";
import { Reveal, SplitTextReveal, StaggerGrid, StaggerItem } from "@/motion";
import styles from "./landing.module.css";

/**
 * Los rubros NO se tocan: los seis vivos van con el punto de encendido y los
 * que vienen quedan a la vista en punteado (mismos nombres que publica la
 * pantalla real de registro y la FAQ — nada inventado).
 */
const RUBROS_VIVOS = [
  "Dental",
  "Comercio",
  "Importadora",
  "Estética",
  "Servicios",
] as const;

// REGLA de Sergio (2026-08-20): en la venta NUNCA se muestra lo que esta en
// construccion — "muy pronto" le dice al cliente "esto no esta listo" y un solo
// cartel contamina la percepcion del producto entero. Lo que no existe no se
// nombra; la demanda de otros rubros se captura con un "escribinos".

/**
 * Escena — los pasos de la pantalla entran EN ORDEN cada vez que la tarjeta
 * aparece. El visual MUESTRA lo que el modulo hace (la conversacion avanza,
 * el cobro se completa) en vez de decorar: el orden ES la explicacion.
 */
function Escena({
  children,
  className = styles.seq,
  paso = 0.45,
}: {
  children: ReactNode;
  className?: string;
  paso?: number;
}) {
  return (
    <StaggerGrid className={className} stagger={paso} repetir>
      {children}
    </StaggerGrid>
  );
}

type Tile = {
  id: string;
  /** Celda del bento: hero (7 col, doble alto) · half (5 col) · third (4 col). */
  celda: "hero" | "half" | "third";
  tone: "white" | "soft" | "green";
  aria: string;
  badge?: string;
  titulo: string;
  beneficio: string;
  visual: ReactNode;
};

/**
 * Bento desigual en vez del carrusel de cards identicas (patron "bento grid
 * activo" de la cosecha Dribbble 2026 en DESIGN_LEARNED §3a): el tile de
 * agentes es el heroe a doble altura — es LA diferencia del producto — y las
 * demas funciones escoltan. El chatbot de WhatsApp ya no vive aca: tiene su
 * seccion propia debajo, con precios y escalera.
 *
 * Los visuales son maquetas: pantallas de adentro de una cuenta con datos, y
 * no se pueden capturar sin cuenta demo. Se cambian por capturas reales una
 * por una en cuanto exista esa cuenta.
 */
const TILES: readonly Tile[] = [
  {
    id: "agentes",
    celda: "hero",
    tone: "soft",
    aria: "Cola de aprobación de Onia: el agente Recall redactó un recordatorio para un paciente que no vuelve hace meses, el agente Cobrador preparó el reclamo de una deuda vencida y hay un aviso de citas de mañana sin confirmar; los botones Aprobar y Descartar esperan el OK del dueño.",
    badge: "Nuevo",
    titulo: "Agentes con IA",
    beneficio:
      "Recall trae de vuelta al que se enfrió; Cobrador persigue la deuda vencida. Trabajan de noche y nada sale sin tu OK.",
    visual: (
      <Shot title="Cola de aprobación" tag="3 pendientes">
        {/* el agente detecta, redacta, y RECIÉN ENTONCES pide tu OK: los
            botones entrando último son el human-in-the-loop, dibujado */}
        <Escena className={styles.approval} paso={0.55}>
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
          <StaggerItem as="span" className={styles.who}>
            Cobrador · C. Vaca, saldo vencido Bs 370
          </StaggerItem>
          <StaggerItem as="span" className={styles.msg}>
            «Hola Carla, quedó pendiente el saldo de la limpieza. ¿Te paso el
            QR?»
          </StaggerItem>
          <StaggerItem as="span" className={styles.acts}>
            <span className={styles.ok}>Aprobar</span>
            <span className={styles.no}>Descartar</span>
          </StaggerItem>
          <StaggerItem as="span" className={styles.who}>
            Aviso · 3 citas de mañana siguen sin confirmar
          </StaggerItem>
          <StaggerItem as="span" className={styles.msg}>
            «¿Les mando el recordatorio ahora?»
          </StaggerItem>
        </Escena>
      </Shot>
    ),
  },
  {
    id: "agenda",
    celda: "half",
    tone: "white",
    aria: "Agenda del día en Onia Platform: tres citas con hora, paciente y duración, y un hueco de 45 minutos marcado.",
    titulo: "Agenda y fichas",
    beneficio: "Todo tu día en una sola pantalla.",
    visual: (
      <Shot title="Agenda · hoy">
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
    id: "reserva",
    celda: "half",
    tone: "white",
    aria: "Reserva pública de citas: el cliente ve los horarios libres del jueves y elige uno desde su teléfono.",
    titulo: "Reserva online",
    beneficio: "Tu cliente se agenda solo, un domingo a las once.",
    visual: (
      <Shot title="Reservar · jueves 6">
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
    id: "cobros",
    celda: "third",
    tone: "green",
    aria: "Cobro en caja: detalle de dos tratamientos, total en bolivianos, cobro con QR confirmado y la venta lista para facturar.",
    badge: "En trámite SIAT",
    titulo: "Cobros y facturación",
    beneficio: "Cobrás con QR y la venta queda lista para el SIAT.",
    visual: (
      <Shot title="Cobro · caja">
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
    id: "web",
    celda: "third",
    tone: "white",
    aria: "Página web del negocio conectada al sistema, con el botón de reservar y los horarios que salen de la misma agenda.",
    titulo: "Página web",
    beneficio: "Conectada al sistema, no huérfana.",
    visual: (
      <Shot title="clinicaandina.bo">
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
    celda: "third",
    tone: "soft",
    aria: "Inventario de insumos con existencias y un aviso de stock mínimo en anestesia.",
    titulo: "Inventario",
    beneficio: "Sabés qué falta antes de que falte.",
    visual: (
      <Shot title="Inventario" tag="1 aviso">
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

const CELDAS = {
  hero: styles.bHero,
  half: styles.bHalf,
  third: styles.bThird,
} as const;

export function Features() {
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

        <Reveal className={styles.rubrosBand}>
          <span className={styles.rubrosLabel}>Andando hoy</span>
          {RUBROS_VIVOS.map((rubro) => (
            <span key={rubro} className={styles.rubroLive}>
              {rubro}
            </span>
          ))}
          <a className={styles.rubroSoon} href="/prueba-gratis">
            ¿Otro rubro? Escribinos
          </a>
        </Reveal>
      </div>

      <div className={`${styles.container} ${styles.bento}`}>
        {TILES.map((tile, i) => (
          <Reveal
            key={tile.id}
            delay={i * 0.05}
            as="div"
            className={`${styles.fcard} ${CELDAS[tile.celda]}`}
          >
            <div
              className={`${styles.fvis} ${TONES[tile.tone]}`}
              role="img"
              aria-label={tile.aria}
            >
              {tile.visual}
            </div>
            <div className={styles.fmeta}>
              {tile.badge ? (
                <span
                  className={`${styles.fbadge} ${
                    tile.badge.startsWith("En trámite") ? styles.fbadgeSoon : ""
                  }`}
                >
                  {tile.badge}
                </span>
              ) : null}
              <h3>{tile.titulo}</h3>
              <p>{tile.beneficio}</p>
            </div>
          </Reveal>
        ))}
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
