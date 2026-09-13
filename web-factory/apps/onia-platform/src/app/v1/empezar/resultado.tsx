"use client";

import * as m from "motion/react-m";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { ModulePower, PressableCta, Reveal, springs } from "@/motion";
import { APP_URL } from "@/lib/site";
import {
  FALTA_COPY,
  tagDeFalta,
  NOTA_CUADERNO,
  NOTA_DOWNSELL,
  NOTA_FACTURACION,
  PLAN_INCLUYE,
  PRECIO_COPY,
} from "./data";
import { recomendar } from "./recommend";
import type { Equipo, Rubro, Tiene } from "./recommend";
import { buildWaHref, normalizeUrl } from "./whatsapp";
import styles from "./wizard.module.css";

/**
 * Pantalla de resultado (spec §2.4/§2.5) — el pago del wizard.
 * La card del plan aterriza con peso y los módulos que faltan se ENCIENDEN en
 * cascada (patrón de modules.tsx: 350ms + i×420ms). reduced-motion: todo
 * encendido de entrada.
 *
 * Había una segunda variante para el rubro "que todavía no": dibujaba sus
 * módulos con tres de cuatro bloques en fantasma, listaba aparte lo que SÍ
 * existe y decía que el motor corre "para seis rubros" cuando el sitio vende
 * cinco. Se fue entera el 2026-09-06 con el dato que la encendía.
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

  return (
    <VarianteDental
      rubro={rubro}
      rec={rec}
      plan={rec.plan}
      url={url}
      waHref={waHref}
      onReset={onReset}
      h1Ref={h1Ref}
    />
  );
}

/* ---- la pantalla del plan ---- */

type Rec = ReturnType<typeof recomendar>;

type VarianteDentalProps = {
  rubro: Rubro;
  rec: Rec;
  plan: NonNullable<Rec["plan"]>;
  url: string;
  waHref: string;
  onReset: () => void;
  h1Ref: RefObject<HTMLHeadingElement | null>;
};

function VarianteDental({
  rubro,
  rec,
  plan,
  url,
  waHref,
  onReset,
  h1Ref,
}: VarianteDentalProps) {
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
        ? // Ni «una persona del equipo» ni «en el día»: no hay equipo —lo vende
          // Sergio Urcullo solo— y el wizard no manda NADA a un servidor
          // nuestro (su única salida es el wa.me que abre el propio lead), así
          // que lo que escribe acá muere en su navegador si no aprieta el
          // botón. Lo que sí es verdad es el mecanismo, y decirlo explica de
          // paso por qué le pedimos el dato.
          `Tu web: ${url}. Viaja en el mensaje de WhatsApp que abrís al final, así la miramos y te decimos qué le falta.`
        : "Tenés web. Si querés que la miremos, pasánosla por WhatsApp.",
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
          {PLAN_INCLUYE[rubro].map((c) => (
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
          {/* /#v4-precios: la portada nueva no tiene id="precios" (A6). */}
          <a href="/#v4-precios">Ver los tres planes con todo lo que incluyen</a> —
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
                  <p className={`mono ${styles.modTag}`}>{tagDeFalta(f, rec.plan.id)}</p>
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
