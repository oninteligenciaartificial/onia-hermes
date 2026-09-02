import type { ReactNode } from "react";
import {
  NAV_HEADER,
  NAV_PRODUCTO,
  NAV_DECIDIR,
  NAV_LEGAL,
  EMPEZAR_URL,
  LOGIN_URL,
} from "./nav";
import { CTA_ALTA } from "./alta";
import { MobileMenu } from "./menu";
import s from "./sitio.module.css";

/**
 * Primitivas del sitio público (v3). Componentes de servidor puros — sin
 * estado ni efectos; el único cliente de este árbol es el conmutador de
 * rubros.
 */

/* ---------- PANEL DIBUJADO (el resultado, no la captura) ----------------- */

type Tone = "green" | "ink" | "paper" | "signal";

const toneClass: Record<Tone, string> = {
  green: s.shape,
  ink: `${s.shape} ${s.shapeInk}`,
  paper: `${s.shape} ${s.shapePaper}`,
  signal: `${s.shape} ${s.shapeSignal}`,
};

/** Los tres paneles dibujados. Cada uno muestra el RESULTADO del cliente, no
 *  la pantalla del sistema (Sergio, 2026-09-01, textual: "no coloques
 *  capturas literales del sistema, se ve mal, coloca cosas referenciales"). */
type Panel = "agentes" | "chat" | "cuenta";

/**
 * Rótulo accesible de cada panel. Va en el CONTENEDOR con role="img": el panel
 * se anuncia como UNA imagen con su frase, y no como fragmentos sueltos de
 * interfaz ("03:12 · cerrado", "Aprobar", "Aprobar", "Aprobar"...).
 *
 * Vive acá y no en el call site a propósito: cada panel tiene UN rótulo
 * correcto, y dejarlo en la llamada era la forma segura de publicar uno vacío
 * — que es exactamente lo que pasaba con el `alt` de la captura.
 */
const panelLabel: Record<Panel, string> = {
  agentes:
    "Pendientes de aprobación a las 03:12, con el negocio cerrado: tres propuestas que los agentes dejaron escritas de madrugada, cada una con su botón de aprobar. Nada se manda hasta que el dueño aprueba.",
  chat:
    "Conversación de WhatsApp a las 23:40: alguien pregunta si atienden el sábado y ya tiene la respuesta con el horario que el negocio publicó.",
  cuenta:
    "Una cuenta recién creada para una clínica dental, con agenda, clientes, cobros, facturación, recordatorios y agentes ya encendidos.",
};

/** Los módulos del panel de cuenta. Ninguno es una promesa nueva: son los que
 *  ya nombra el copy de /empezar y la descripción del sitio. */
const MODULOS = [
  "Agenda",
  "Clientes",
  "Cobros",
  "Facturación",
  "Recordatorios",
  "Agentes",
] as const;

/** Lo que los agentes dejan escrito. Sin números ni nombres de cliente: un
 *  conteo inventado dentro de una interfaz creíble se lee como dato real, y no
 *  hay un solo cliente pagando todavía. */
const PENDIENTES = [
  "Recordar las citas de mañana",
  "Avisar los pagos vencidos",
  "Volver a invitar a quien no vino",
] as const;

function PanelCuerpo({ panel }: { panel: Panel }) {
  if (panel === "agentes") {
    return (
      <>
        <div className={s.panelHead}>
          <span className={s.panelMark} />
          <span className={s.panelTitle}>Pendientes de aprobación</span>
          <span className={s.panelStamp}>03:12 · cerrado</span>
        </div>
        <ul className={s.panelRows}>
          {PENDIENTES.map((q) => (
            <li key={q} className={s.panelRow}>
              <span className={s.panelSq} />
              <span className={s.panelTxt}>{q}</span>
              <span className={s.panelAct}>Aprobar</span>
            </li>
          ))}
        </ul>
        <p className={s.panelFoot}>Nada se manda hasta que lo aprobás.</p>
      </>
    );
  }

  if (panel === "chat") {
    return (
      <>
        <div className={s.panelHead}>
          <span className={s.panelMark} />
          <span className={s.panelTitle}>WhatsApp del negocio</span>
          <span className={s.panelStamp}>23:40 · cerrado</span>
        </div>
        <div className={s.panelChat}>
          <div className={`${s.panelMsg} ${s.panelIn}`}>
            Hola, ¿atienden mañana sábado?
          </div>
          <div className={`${s.panelMsg} ${s.panelOut}`}>
            Sí, sábado de 9:00 a 13:00.
          </div>
        </div>
        <p className={s.panelFoot}>Contestó con el horario que vos publicaste.</p>
      </>
    );
  }

  return (
    <>
      <div className={s.panelHead}>
        <span className={s.panelMark} />
        <span className={s.panelTitle}>Tu cuenta</span>
        <span className={s.panelStamp}>Dental</span>
      </div>
      <div className={s.panelGrid}>
        {MODULOS.map((m) => (
          <span key={m} className={s.panelPill}>
            <span className={s.panelSq} />
            <span className={s.panelPillTxt}>{m}</span>
          </span>
        ))}
      </div>
      <p className={s.panelFoot}>Encendidos desde el primer día.</p>
    </>
  );
}

/**
 * Bloque de color que dibuja una interfaz INVENTADA mostrando el resultado del
 * cliente. Cero <img>, cero <svg>, cero sombra: la profundidad es la tarjeta
 * clara apoyada sobre el mat de color del tono. Mismo invariante que el hero
 * aprobado el 2026-09-01, y el `aspect-ratio` fijo del mat sigue reservando el
 * alto de la columna (cero CLS).
 *
 * `panel` es OBLIGATORIO y ya no existe una rama de imagen: la regresión
 * "volvamos a cablear la captura" no compila, que vale más que un test.
 */
export function Shape({ panel, tone = "green" }: { panel: Panel; tone?: Tone }) {
  return (
    <div className={toneClass[tone]} role="img" aria-label={panelLabel[panel]}>
      <div className={s.panel}>
        <PanelCuerpo panel={panel} />
      </div>
    </div>
  );
}

/* ---------- bloque de sección plano ------------------------------------- */

const surfaceClass: Record<Tone, string> = {
  paper: s.paper,
  ink: s.ink,
  green: s.green,
  signal: s.signalBlock,
};

export function Block({
  surface = "paper",
  children,
  id,
  labelledBy,
  className,
}: {
  surface?: Tone | "paperDim";
  children: ReactNode;
  id?: string;
  labelledBy?: string;
  /** Ajuste puntual del ritmo de UN bloque (hoy: el aire del hero en teléfono). */
  className?: string;
}) {
  const cls = surface === "paperDim" ? s.paperDim : surfaceClass[surface as Tone];
  return (
    <section
      className={`${s.block} ${cls}${className ? ` ${className}` : ""}`}
      id={id}
      aria-labelledby={labelledBy}
    >
      <div className={s.inner}>{children}</div>
    </section>
  );
}

/* ---------- botones y kicker -------------------------------------------- */

export function Btn({
  href,
  children,
  variant = "solid",
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "line";
  external?: boolean;
}) {
  const cls = variant === "line" ? `${s.btn} ${s.btnLine}` : s.btn;
  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <a className={cls} href={href} {...ext}>
      {children}
    </a>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className={s.kicker}>{children}</p>;
}

/* ---------- datos estructurados ----------------------------------------- */

/**
 * Inyecta el JSON-LD de la página. Existía en la v1 (Organization,
 * SoftwareApplication, Service, Article, FAQPage, BreadcrumbList) y NO se
 * pierde en el rediseño: cada página trae el suyo con la ruta nueva.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ---------- chrome ------------------------------------------------------ */

export function Header() {
  return (
    <header className={s.header}>
      <div className={s.headerInner}>
        <a className={s.wordmark} href="/" aria-label="Onia — inicio">
          Onia<b>.</b>
        </a>
        <nav className={s.nav} aria-label="Secciones">
          {NAV_HEADER.map((item) => (
            <a key={item.href} className={s.navLink} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={s.headerCta}>
          <a className={s.headerLogin} href={LOGIN_URL}>
            Entrar
          </a>
          <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.footerInner}>
        <div className={s.footerBrand}>
          <span className={s.wordmark} style={{ color: "#fff" }}>
            Onia<b>.</b>
          </span>
          <p className={s.footerTag}>Sistema de gestión con IA · Bolivia</p>
        </div>

        <nav className={s.footerNav} aria-label="Producto">
          <p className={s.footerGroup}>Producto</p>
          {NAV_PRODUCTO.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <nav className={s.footerNav} aria-label="Decidir">
          <p className={s.footerGroup}>Decidir</p>
          {NAV_DECIDIR.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href={LOGIN_URL}>Entrar</a>
        </nav>
      </div>

      <div className={s.footerLegal}>
        {/* Los legales viven UNA vez, en el producto. Acá se linkean. */}
        {NAV_LEGAL.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
