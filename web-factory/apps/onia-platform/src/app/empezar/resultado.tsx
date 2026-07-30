"use client";

import * as m from "motion/react-m";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { ModulePower, PressableCta, Reveal, springs } from "@/motion";
import { APP_URL } from "@/lib/site";
import {
  FALTA_COPY,
  FALTA_TAG,
  HOY_EXISTE,
  NOTA_CUADERNO,
  NOTA_DOWNSELL,
  NOTA_FACTURACION,
  PLAN_INCLUYE,
  PRECIO_COPY,
  PROXIMO_ASSEMBLY,
} from "./data";
import { recomendar } from "./recommend";
import type { Equipo, Rubro, Tiene } from "./recommend";
import { buildWaHref, normalizeUrl } from "./whatsapp";
import styles from "./wizard.module.css";

/**
 * Pantalla de resultado (spec §2.4/§2.5) — el pago del wizard.
 * Variante A (dental): la card del plan aterriza con peso y los módulos que
 * faltan se ENCIENDEN en cascada (patrón de modules.tsx: 350ms + i×420ms).
 * Variante B (próximamente): lista de espera honesta con ensamblaje a medio
 * armar (patrón de rubros.tsx). reduced-motion: todo encendido de entrada.
 */

const CASCADE_MS = 420;

type ResultadoProps = {
  rubro: Rubro;
  equipo: Equipo;
  tiene: readonly Tiene[];
  webUrl: string;
  onReset: () => void;
  autoFocusH1: boolean;
};

export function Resultado({
  rubro,
  equipo,
  tiene,
  webUrl,
  onReset,
  autoFocusH1,
}: ResultadoProps) {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (autoFocusH1) h1Ref.current?.focus();
  }, [autoFocusH1]);

  const rec = useMemo(
    () => recomendar(rubro, equipo, new Set(tiene), webUrl.trim() || undefined),
    [rubro, equipo, tiene, webUrl],
  );
  const waHref = useMemo(
    () => buildWaHref(rubro, equipo, tiene, webUrl, rec),
    [rubro, equipo, tiene, webUrl, rec],
  );
  const url = normalizeUrl(webUrl);

  return rec.disponible && rec.plan ? (
    <VarianteDental
      rec={rec}
      plan={rec.plan}
      url={url}
      waHref={waHref}
      onReset={onReset}
      h1Ref={h1Ref}
    />
  ) : (
    <VarianteProximamente
      rubro={rubro as Exclude<Rubro, "dental">}
      rec={rec}
      url={url}
      waHref={waHref}
      onReset={onReset}
      h1Ref={h1Ref}
    />
  );
}

/* ---- Variante A · dental ---- */

type Rec = ReturnType<typeof recomendar>;

type VarianteDentalProps = {
  rec: Rec;
  plan: NonNullable<Rec["plan"]>;
  url: string;
  waHref: string;
  onReset: () => void;
  h1Ref: RefObject<HTMLHeadingElement | null>;
};

function VarianteDental({ rec, plan, url, waHref, onReset, h1Ref }: VarianteDentalProps) {
  const lackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(lackRef, { once: true, amount: 0.2 });
  const reduced = useReducedMotion();
  const [on, setOn] = useState<boolean[]>(() => rec.faltan.map(() => false));
  const cascaded = useRef(false);

  // cascada de encendido de "lo que te falta" — timers con cleanup,
  // arranca recién cuando el bloque entra al viewport (una sola vez)
  useEffect(() => {
    if (!inView || cascaded.current || rec.faltan.length === 0) return;
    cascaded.current = true;
    if (reduced) {
      setOn(rec.faltan.map(() => true));
      return;
    }
    const ids = rec.faltan.map((_, i) =>
      window.setTimeout(() => {
        setOn((prev) => {
          if (prev[i]) return prev;
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 350 + i * CASCADE_MS),
    );
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [inView, reduced, rec.faltan]);

  const yaTenesLineas: { id: string; texto: string }[] = [];
  if (rec.yaTenes.includes("web")) {
    yaTenesLineas.push({
      id: "web",
      texto: url
        ? `Tu web: ${url}. Una persona del equipo la revisa y te manda el análisis gratis por WhatsApp en el día.`
        : "Tenés web. Si querés el análisis gratis, pasánosla por WhatsApp.",
    });
  }
  if (rec.yaTenes.includes("chatbot")) {
    yaTenesLineas.push({ id: "chatbot", texto: "Chatbot: ya tenés uno andando." });
  }
  if (rec.yaTenes.includes("sistema")) {
    yaTenesLineas.push({
      id: "sistema",
      texto:
        "Ya usás un sistema. No te pedimos migrar a ciegas: probá la demo y compará con lo tuyo.",
    });
  }
  if (rec.yaTenes.includes("facturacion")) {
    yaTenesLineas.push({ id: "facturacion", texto: "Ya facturás electrónico." });
  }

  return (
    <div>
      <p className="kicker">Tu recomendación</p>
      <h1 ref={h1Ref} tabIndex={-1} className={styles.q}>
        Esto es lo que encenderíamos para vos.
      </h1>
      <p className={styles.sub}>Armado con tus 3 respuestas — nada genérico.</p>

      {/* la card del plan aterriza con peso; el precio aparece FIRME, sin count-up */}
      <m.section
        className={styles.planCard}
        aria-label="Plan recomendado"
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={springs.heavy}
      >
        <span className="badge badge-on">DISPONIBLE</span>
        <h2 className={styles.planName}>{plan.nombre}</h2>
        <p className={`mono ${styles.planPrice}`}>{PRECIO_COPY[plan.precio]}</p>
        <ul className={styles.chips} aria-label="Incluye">
          {PLAN_INCLUYE.map((c) => (
            <li key={c} className={styles.chip}>
              <span className={styles.chipDot} aria-hidden />
              {c}
            </li>
          ))}
        </ul>
        {rec.notas.includes("cuaderno") ? (
          <p className={styles.planNote}>{NOTA_CUADERNO}</p>
        ) : null}
        {rec.notas.includes("facturacion-incluida") ? (
          <p className={styles.planNote}>{NOTA_FACTURACION}</p>
        ) : null}
        {rec.notas.includes("downsell-basico") ? (
          <p className={styles.planNote}>{NOTA_DOWNSELL}</p>
        ) : null}
        <p className={styles.planNote}>
          <a href="/#precios">Ver los tres planes con todo lo que incluyen</a> —
          los precios están publicados, no hay que pedirlos.
        </p>
      </m.section>

      {rec.faltan.length > 0 ? (
        <div ref={lackRef} className={styles.block}>
          <p className={`mono ${styles.blockTitle}`}>Lo que te falta</p>
          <div className={styles.mods}>
            {rec.faltan.map((f, i) => (
              <article
                key={f}
                className={`${styles.mod} ${on[i] ? styles.modOn : ""}`}
              >
                <ModulePower on={on[i]}>
                  <h3 className={styles.modName}>{FALTA_COPY[f].nombre}</h3>
                  <p className={styles.modCopy}>{FALTA_COPY[f].copy}</p>
                  <p className={`mono ${styles.modTag}`}>{FALTA_TAG}</p>
                </ModulePower>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {yaTenesLineas.length > 0 ? (
        <Reveal className={styles.block}>
          <p className={`mono ${styles.blockTitle}`}>Ya lo tenés</p>
          <ul className={styles.have}>
            {yaTenesLineas.map((l) => (
              <li key={l.id} className={styles.haveItem}>
                <span className={styles.haveCheck} aria-hidden>
                  ✓
                </span>
                {l.texto}
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      <CierreCtas
        waHref={waHref}
        waLabel="Armar mi cuenta por WhatsApp"
        secundario={{ label: "Probar la demo", href: APP_URL }}
        micro="Responde una persona, no un menú. La demo anda con datos de ejemplo, sin compromiso."
        onReset={onReset}
      />
    </div>
  );
}

/* ---- Variante B · rubro próximamente ---- */

type VarianteProximamenteProps = {
  rubro: Exclude<Rubro, "dental">;
  rec: Rec;
  url: string;
  waHref: string;
  onReset: () => void;
  h1Ref: RefObject<HTMLHeadingElement | null>;
};

function VarianteProximamente({
  rubro,
  rec,
  url,
  waHref,
  onReset,
  h1Ref,
}: VarianteProximamenteProps) {
  const arm = PROXIMO_ASSEMBLY[rubro];
  const conAnalisis = rec.analisisWeb && url !== "";

  return (
    <div>
      <p className="kicker">Tu recomendación</p>
      <h1 ref={h1Ref} tabIndex={-1} className={styles.q}>
        Tu rubro está en construcción — sin humo.
      </h1>
      <p className={styles.sub}>
        {arm.nombre} se está armando sobre el mismo motor que ya corre en el
        pack dental. No vendemos lo que no existe ni le ponemos precio a lo que
        no está listo: anotate y te avisamos apenas esté, con tu caso ya
        registrado para que no repitas nada.
      </p>

      {/* ensamblaje a medio armar — patrón aBlock/aGhost de rubros.tsx */}
      <div className={styles.assembly} aria-hidden>
        {arm.blocks.map((b, i) => {
          const ghost = i >= arm.built;
          return (
            <m.div
              key={b}
              className={`${styles.aBlock} ${ghost ? styles.aGhost : ""}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: ghost ? 0.55 : 1, y: 0, scale: 1 }}
              transition={{ ...springs.heavy, delay: 0.08 + i * 0.11 }}
            >
              <span className={styles.aDot} />
              {b}
              {ghost ? (
                <span className={styles.aGhostNote}>en construcción</span>
              ) : null}
            </m.div>
          );
        })}
      </div>

      <Reveal className={styles.block}>
        <p className={`mono ${styles.blockTitle}`}>Esto sí existe hoy</p>
        <ul className={styles.chips}>
          {HOY_EXISTE.map((c) => (
            <li key={c} className={styles.chip}>
              <span className={styles.chipDot} aria-hidden />
              {c}
            </li>
          ))}
        </ul>
        <p className={styles.planNote}>
          Se cotizan según tu caso — pedilos en el mismo WhatsApp.
        </p>
      </Reveal>

      {conAnalisis ? (
        <Reveal className={styles.block}>
          <p className={styles.haveItem}>
            <span className={styles.haveCheck} aria-hidden>
              ✓
            </span>
            Mientras tanto, algo hoy: nos pasaste {url} — una persona del
            equipo la revisa y te manda el análisis gratis por WhatsApp en el
            día.
          </p>
        </Reveal>
      ) : null}

      <CierreCtas
        waHref={waHref}
        waLabel="Anotarme — avísenme cuando esté"
        secundario={{ label: "Ver el pack que ya anda", href: "/#rubros" }}
        micro="Responde una persona, no un menú."
        onReset={onReset}
      />
    </div>
  );
}

/* ---- cierre común ---- */

type CierreCtasProps = {
  waHref: string;
  waLabel: string;
  secundario: { label: string; href: string };
  micro: string;
  onReset: () => void;
};

function CierreCtas({ waHref, waLabel, secundario, micro, onReset }: CierreCtasProps) {
  return (
    <div className={styles.cierre}>
      <div className={styles.ctas}>
        <PressableCta>
          <a href={waHref} className="btn btn-wa">
            <span className="btn-dot" aria-hidden />
            {waLabel}
          </a>
        </PressableCta>
        <PressableCta>
          <a href={secundario.href} className="btn btn-ghost">
            {secundario.label}
          </a>
        </PressableCta>
      </div>
      <p className={styles.ctaMicro}>{micro}</p>
      <button type="button" className={styles.reset} onClick={onReset}>
        Volver a empezar
      </button>
    </div>
  );
}
