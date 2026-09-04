"use client";

import * as m from "motion/react-m";
import { AnimatePresence, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { springs } from "@/motion";
import { EQUIPO_OPTIONS, RUBRO_OPTIONS, TIENE_OPTIONS } from "./data";
import type { Equipo, Rubro, Tiene } from "./recommend";
import { Resultado } from "./resultado";
import { StepEquipo, StepRubro, StepTiene } from "./steps";
import styles from "./wizard.module.css";

/**
 * Wizard /empezar — 3 preguntas + resultado. Estado 100% en React con copia
 * de respaldo en sessionStorage (spec §4: cero backend, cero datos personales;
 * la única salida real es el link wa.me que abre el propio usuario).
 */

type Paso = 1 | 2 | 3 | 4; // 4 = resultado

const STORE_KEY = "onia.empezar.v1";

interface Stored {
  paso: Paso;
  rubro: Rubro | null;
  equipo: Equipo | null;
  tiene: Tiene[];
  webUrl: string;
}

const RUBROS_OK = new Set<string>(RUBRO_OPTIONS.map((o) => o.id));
const EQUIPOS_OK = new Set<string>(EQUIPO_OPTIONS.map((o) => o.id));
const TIENE_OK = new Set<string>(TIENE_OPTIONS.map((o) => o.id));

/** Valida lo restaurado de sessionStorage — nunca confiar en datos externos. */
function sanitize(raw: unknown): Stored | null {
  if (typeof raw !== "object" || raw === null) return null;
  const s = raw as Partial<Stored>;
  const rubro =
    typeof s.rubro === "string" && RUBROS_OK.has(s.rubro)
      ? (s.rubro as Rubro)
      : null;
  const equipo =
    typeof s.equipo === "string" && EQUIPOS_OK.has(s.equipo)
      ? (s.equipo as Equipo)
      : null;
  const tiene = Array.isArray(s.tiene)
    ? (s.tiene.filter(
        (t): t is Tiene => typeof t === "string" && TIENE_OK.has(t),
      ) as Tiene[])
    : [];
  const webUrl = typeof s.webUrl === "string" ? s.webUrl.slice(0, 200) : "";
  let paso: Paso =
    s.paso === 2 || s.paso === 3 || s.paso === 4 ? s.paso : 1;
  // consistencia: no saltar a un paso cuyo requisito falta
  if (paso >= 2 && rubro === null) paso = 1;
  if (paso >= 3 && equipo === null) paso = 2;
  return { paso, rubro, equipo, tiene, webUrl };
}

/** Transición direccional entre pasos (P10 del banco, patrón de rubros.tsx). */
const stepVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, y: dir >= 0 ? 16 : -16 }),
  center: { opacity: 1, y: 0 },
  exit: (dir: number) => ({ opacity: 0, y: dir >= 0 ? -10 : 10 }),
};

export function Wizard() {
  const [paso, setPaso] = useState<Paso>(1);
  const [dir, setDir] = useState(1);
  const [rubro, setRubro] = useState<Rubro | null>(null);
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [tiene, setTiene] = useState<readonly Tiene[]>([]);
  const [webUrl, setWebUrl] = useState("");
  const restored = useRef(false);
  const navegado = useRef(false);

  // restaurar respaldo (sobrevive un refresh a mitad de wizard)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORE_KEY);
      if (raw) {
        const s = sanitize(JSON.parse(raw));
        if (s) {
          setPaso(s.paso);
          setRubro(s.rubro);
          setEquipo(s.equipo);
          setTiene(s.tiene);
          setWebUrl(s.webUrl);
        }
      }
    } catch {
      /* storage bloqueado o corrupto: el wizard vive solo en memoria */
    }
    restored.current = true;
  }, []);

  // persistir cada cambio
  useEffect(() => {
    if (!restored.current) return;
    try {
      sessionStorage.setItem(
        STORE_KEY,
        JSON.stringify({ paso, rubro, equipo, tiene, webUrl }),
      );
    } catch {
      /* sin storage no hay respaldo — el estado en memoria alcanza */
    }
  }, [paso, rubro, equipo, tiene, webUrl]);

  function irA(siguiente: Paso, direccion: 1 | -1) {
    navegado.current = true;
    setDir(direccion);
    setPaso(siguiente);
  }

  function toggleTiene(t: Tiene) {
    setTiene((prev) => {
      const marcado = prev.includes(t);
      // "Nada de esto todavía" es exclusiva: marca sola, y cualquier otra la desmarca
      if (t === "nada") return marcado ? prev.filter((x) => x !== t) : ["nada"];
      const sinNada = prev.filter((x) => x !== t && x !== "nada");
      return marcado ? sinNada : [...sinNada, t];
    });
  }

  function reset() {
    setRubro(null);
    setEquipo(null);
    setTiene([]);
    setWebUrl("");
    try {
      sessionStorage.removeItem(STORE_KEY);
    } catch {
      /* sin storage no hay nada que borrar */
    }
    irA(1, -1);
  }

  const enResultado = paso === 4;
  const label = enResultado ? "Resultado" : `Paso ${paso} de 3`;

  return (
    <div className={styles.wizard}>
      {/* barra de progreso — P11 adaptado: scaleX, nunca width */}
      <div className={styles.progressZone}>
        <div
          className={styles.track}
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={enResultado ? 3 : paso}
          aria-label="Progreso del asistente"
        >
          <m.div
            className={styles.fill}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: enResultado ? 1 : paso / 3 }}
            transition={springs.gentle}
          />
        </div>
        <span className={`mono ${styles.pasoLabel}`} aria-live="polite">
          {label}
        </span>
      </div>

      <div className={styles.stage}>
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <m.div
            key={paso}
            custom={dir}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springs.gentle}
          >
            {paso === 1 ? (
              <StepRubro
                rubro={rubro}
                onSelect={setRubro}
                onNext={() => irA(2, 1)}
                autoFocusH1={navegado.current}
              />
            ) : paso === 2 ? (
              <StepEquipo
                equipo={equipo}
                onSelect={setEquipo}
                onBack={() => irA(1, -1)}
                onNext={() => irA(3, 1)}
                autoFocusH1={navegado.current}
              />
            ) : paso === 3 ? (
              <StepTiene
                tiene={tiene}
                onToggle={toggleTiene}
                webUrl={webUrl}
                onWebUrl={setWebUrl}
                onBack={() => irA(2, -1)}
                onNext={() => irA(4, 1)}
                autoFocusH1={navegado.current}
              />
            ) : rubro !== null && equipo !== null ? (
              <Resultado
                rubro={rubro}
                equipo={equipo}
                tiene={tiene}
                webUrl={webUrl}
                onReset={reset}
                autoFocusH1={navegado.current}
              />
            ) : null}
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
