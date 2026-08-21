import type { CSSProperties, ReactNode } from "react";
import {
  NAV_HEADER,
  NAV_PRODUCTO,
  NAV_DECIDIR,
  NAV_LEGAL,
  EMPEZAR_URL,
  LOGIN_URL,
} from "./nav";
import { MobileMenu } from "./menu";
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

export function PreviewHeader() {
  return (
    <header className={s.header}>
      <div className={s.headerInner}>
        <a className={s.wordmark} href="/preview" aria-label="Onia — inicio del preview">
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
          <Btn href={EMPEZAR_URL}>Probá gratis</Btn>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

export function PreviewFooter() {
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
