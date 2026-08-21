import type { CSSProperties, ReactNode } from "react";
import s from "./preview.module.css";

/**
 * Primitivas del preview (v3). Componentes de servidor puros — sin estado ni
 * efectos; el único cliente del preview es el conmutador de rubros.
 */

/* ---------- placeholder de FORMA (reserva el ratio del clip futuro) ------- */

type Tone = "green" | "ink" | "paper" | "signal";

const toneClass: Record<Tone, string> = {
  green: s.shape,
  ink: `${s.shape} ${s.shapeInk}`,
  paper: `${s.shape} ${s.shapePaper}`,
  signal: `${s.shape} ${s.shapeSignal}`,
};

/**
 * Bloque de forma+color que RESERVA el ratio donde luego entra un clip o
 * captura. Declara aspect-ratio, así el clip real entra sin CLS. No dice
 * "próximamente": es composición de marca (regla: la venta nunca exhibe obra).
 */
export function Shape({
  tone = "green",
  ratio = "4 / 3",
  tag,
  bars = true,
}: {
  tone?: Tone;
  ratio?: string;
  tag?: string;
  bars?: boolean;
}) {
  return (
    <div
      className={toneClass[tone]}
      style={{ "--shape-ratio": ratio } as CSSProperties}
      aria-hidden="true"
    >
      {bars && (
        <div className={s.shapeBars}>
          <span className={s.shapeBar} />
          <span className={s.shapeBar} />
          <span className={s.shapeBar} />
        </div>
      )}
      {tag && <span className={s.shapeTag}>{tag}</span>}
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
}: {
  surface?: Tone | "paperDim";
  children: ReactNode;
  id?: string;
  labelledBy?: string;
}) {
  const cls = surface === "paperDim" ? s.paperDim : surfaceClass[surface as Tone];
  return (
    <section className={`${s.block} ${cls}`} id={id} aria-labelledby={labelledBy}>
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

/* ---------- chrome ------------------------------------------------------ */

const NAV = [
  { href: "/preview/rubros", label: "Rubros" },
  { href: "/preview/chatbot", label: "Chatbot" },
  { href: "/preview/agentes", label: "Agentes" },
  { href: "/preview/precios", label: "Precios" },
] as const;

export function PreviewHeader() {
  return (
    <header className={s.header}>
      <div className={s.headerInner}>
        <a className={s.wordmark} href="/preview" aria-label="Onia — inicio del preview">
          Onia<b>.</b>
        </a>
        <nav className={s.nav} aria-label="Secciones">
          {NAV.map((item) => (
            <a key={item.href} className={s.navLink} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={s.headerCta}>
          <Btn href="/prueba-gratis">Probá gratis</Btn>
        </div>
      </div>
    </header>
  );
}

export function PreviewFooter() {
  return (
    <footer className={s.footer}>
      <div className={s.footerInner}>
        <span className={s.wordmark} style={{ color: "#fff" }}>
          Onia<b>.</b>
        </span>
        <span style={{ opacity: 0.7 }}>Sistema de gestión con IA · Bolivia</span>
        <nav className={s.footerNav} aria-label="Secciones">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
