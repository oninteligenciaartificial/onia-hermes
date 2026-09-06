"use client";

import * as m from "motion/react-m";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { PressableCta, StaggerGrid, StaggerItem, easeOutExpo, springs } from "@/motion";
import {
  EQUIPO_OPTIONS,
  ESCAPE_WA_URL,
  RUBRO_OPTIONS,
  TIENE_OPTIONS,
} from "./data";
import type { Equipo, Rubro, Tiene } from "./recommend";
import styles from "./wizard.module.css";

/**
 * Pantallas de pregunta del wizard (spec §2.1–§2.3). Radios y checkboxes
 * NATIVOS estilizados — flechas, espacio y foco vienen gratis del browser.
 * Al montar cada paso, el foco va al h1 (solo si ya se navegó: nunca robar
 * foco en el primer paint de la página).
 */

function useH1Focus(autoFocus: boolean) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);
  return ref;
}

/* ---- piezas compartidas ---- */

type RadioCardProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
};

/** Card-radio con LED (P6 + estado encendido — el verde ES la selección). */
function RadioCard({ name, value, checked, onChange, children }: RadioCardProps) {
  return (
    <PressableCta className={styles.optPress}>
      <label className={`${styles.opt} ${checked ? styles.optOn : ""}`}>
        <input
          type="radio"
          className={styles.srOnly}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
        />
        <span className={styles.optLed} aria-hidden />
        {children}
      </label>
    </PressableCta>
  );
}

type NavRowProps = {
  onBack?: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
  onNext: () => void;
};

function NavRow({ onBack, nextLabel, nextDisabled, onNext }: NavRowProps) {
  return (
    <div className={styles.navRow}>
      {onBack ? (
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          ← Atrás
        </button>
      ) : null}
      <button
        type="button"
        className={`btn ${styles.btnPrimary}`}
        disabled={nextDisabled}
        onClick={onNext}
      >
        {nextLabel}
      </button>
    </div>
  );
}

/* ---- Paso 1 · Rubro ---- */

type StepRubroProps = {
  rubro: Rubro | null;
  onSelect: (r: Rubro) => void;
  onNext: () => void;
  autoFocusH1: boolean;
};

export function StepRubro({ rubro, onSelect, onNext, autoFocusH1 }: StepRubroProps) {
  const h1Ref = useH1Focus(autoFocusH1);
  return (
    <div>
      <p className="kicker">Empecemos</p>
      <h1 ref={h1Ref} tabIndex={-1} className={styles.q}>
        ¿De qué es tu negocio?
      </h1>
      <p className={styles.sub}>
        Onia se configura según el rubro: sus fichas, su agenda, su forma de
        cobrar. Elegí el tuyo.
      </p>

      <fieldset className={styles.fieldset}>
        <legend className={styles.srOnly}>¿De qué es tu negocio?</legend>
        <div className={styles.opts}>
          {/* Todo lo que se lista se contrata hoy: el badge lo AFIRMA, no
              elige entre dos estados. Acá vivía `o.disponible ? "DISPONIBLE" :
              "PRÓXIMAMENTE"` con su nota de lista de espera debajo — obra a la
              vista en la pantalla de venta, esperando un `false` que nadie
              había puesto todavía. Ver la cabecera de RubroOption en data.ts. */}
          {RUBRO_OPTIONS.map((o) => (
            <div key={o.id}>
              <RadioCard
                name="rubro"
                value={o.id}
                checked={rubro === o.id}
                onChange={() => onSelect(o.id)}
              >
                <span className={styles.optBody}>
                  <span className={styles.optName}>{o.nombre}</span>
                  <span className={styles.optDesc}>{o.desc}</span>
                </span>
                <span className={`badge badge-on ${styles.optBadge}`}>
                  DISPONIBLE
                </span>
              </RadioCard>
            </div>
          ))}
        </div>
      </fieldset>

      <p className={styles.escape}>
        ¿Tu rubro no está en la lista?{" "}
        <a href={ESCAPE_WA_URL}>Contanos por WhatsApp</a>
      </p>

      <NavRow nextLabel="Continuar" nextDisabled={rubro === null} onNext={onNext} />
    </div>
  );
}

/* ---- Paso 2 · Equipo ---- */

type StepEquipoProps = {
  equipo: Equipo | null;
  onSelect: (e: Equipo) => void;
  onBack: () => void;
  onNext: () => void;
  autoFocusH1: boolean;
};

export function StepEquipo({
  equipo,
  onSelect,
  onBack,
  onNext,
  autoFocusH1,
}: StepEquipoProps) {
  const h1Ref = useH1Focus(autoFocusH1);
  return (
    <div>
      <h1 ref={h1Ref} tabIndex={-1} className={styles.q}>
        ¿Cuántos son en el equipo?
      </h1>
      <p className={styles.sub}>Contando a todos los que usarían el sistema.</p>

      <fieldset className={styles.fieldset}>
        <legend className={styles.srOnly}>¿Cuántos son en el equipo?</legend>
        <div className={styles.opts}>
          {EQUIPO_OPTIONS.map((o) => (
            <RadioCard
              key={o.id}
              name="equipo"
              value={o.id}
              checked={equipo === o.id}
              onChange={() => onSelect(o.id)}
            >
              <span className={styles.optName}>{o.label}</span>
            </RadioCard>
          ))}
        </div>
      </fieldset>

      <NavRow
        onBack={onBack}
        nextLabel="Continuar"
        nextDisabled={equipo === null}
        onNext={onNext}
      />
    </div>
  );
}

/* ---- Paso 3 · Qué tenés hoy ---- */

type StepTieneProps = {
  tiene: readonly Tiene[];
  onToggle: (t: Tiene) => void;
  webUrl: string;
  onWebUrl: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
  autoFocusH1: boolean;
};

export function StepTiene({
  tiene,
  onToggle,
  webUrl,
  onWebUrl,
  onBack,
  onNext,
  autoFocusH1,
}: StepTieneProps) {
  const h1Ref = useH1Focus(autoFocusH1);
  const reduced = useReducedMotion();
  const conWeb = tiene.includes("web");

  return (
    <div>
      <h1 ref={h1Ref} tabIndex={-1} className={styles.q}>
        ¿Con qué manejás tu negocio hoy?
      </h1>
      <p className={styles.sub}>
        Marcá todo lo que aplique. Sin vergüenza — la mayoría arranca con el
        cuaderno.
      </p>

      <fieldset className={styles.fieldset}>
        <legend className={styles.srOnly}>¿Con qué manejás tu negocio hoy?</legend>
        <StaggerGrid className={styles.opts}>
          {TIENE_OPTIONS.map((o) => {
            const checked = tiene.includes(o.id);
            return (
              <StaggerItem key={o.id}>
                <label className={`${styles.opt} ${checked ? styles.optOn : ""}`}>
                  <input
                    type="checkbox"
                    className={styles.srOnly}
                    name="tiene"
                    value={o.id}
                    checked={checked}
                    onChange={() => onToggle(o.id)}
                  />
                  <span className={styles.checkBox} aria-hidden>
                    <m.svg
                      viewBox="0 0 16 16"
                      className={styles.checkFill}
                      initial={false}
                      animate={{
                        scale: checked ? 1 : 0.6,
                        opacity: checked ? 1 : 0,
                      }}
                      transition={springs.snappy}
                    >
                      <rect width="16" height="16" rx="4" fill="var(--accent)" />
                      <path
                        d="M4 8.2 7 11l5-6"
                        stroke="var(--surface)"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </m.svg>
                  </span>
                  <span className={styles.optName}>{o.label}</span>
                </label>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </fieldset>

      {/* reveal del input URL — mismo recurso que openDoor de doors.tsx */}
      <AnimatePresence initial={false}>
        {conWeb ? (
          <m.div
            key="url"
            className={styles.urlReveal}
            initial={
              reduced
                ? { opacity: 0 }
                : { clipPath: "inset(0 0 100% 0)", opacity: 0 }
            }
            animate={
              reduced
                ? { opacity: 1 }
                : { clipPath: "inset(0 0 0% 0)", opacity: 1 }
            }
            exit={
              reduced
                ? { opacity: 0 }
                : { clipPath: "inset(0 0 100% 0)", opacity: 0 }
            }
            transition={{ duration: 0.4, ease: easeOutExpo }}
          >
            <label className={styles.urlLabel} htmlFor="empezar-web-url">
              Pasanos tu web y la analizamos gratis
            </label>
            <input
              id="empezar-web-url"
              type="text"
              inputMode="url"
              autoComplete="url"
              className={styles.urlInput}
              placeholder="tunegocio.com.bo"
              value={webUrl}
              onChange={(e) => onWebUrl(e.target.value)}
            />
            {/*
              Acá decía «lo hace una persona del equipo, no un robot — te lo
              mandamos por WhatsApp en el día»: se lucía contra el robot con un
              equipo que no existe, y le ponía plazo a algo que ningún circuito
              entrega. Este campo no viaja a ningún servidor nuestro: lo que se
              escribe acá sólo sale en el mensaje de WhatsApp que abre el lead.
              Decir eso es verdad y además explica por qué le pedimos el dato.
            */}
            <p className={styles.urlMicro}>
              Viaja en el mensaje de WhatsApp que abrís al final: así la miramos
              y te decimos qué le falta.
            </p>
          </m.div>
        ) : null}
      </AnimatePresence>

      <NavRow onBack={onBack} nextLabel="Ver mi recomendación" onNext={onNext} />
    </div>
  );
}
