"use client";

import * as m from "motion/react-m";
import { useInView, useMotionValueEvent, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { SplitTextReveal, StickyScene, springs, useSceneProgress } from "@/motion";
import { useIsDesktop } from "@/lib/use-media";
import { DisplayToggle } from "@/components/ui/display-toggle";
import styles from "./how-it-works.module.css";

/**
 * Seccion b — scrollytelling suave: UNA misma maqueta de cuenta que va
 * mutando por paso (elegir rubro → bloques que encajan → toggles).
 * Desktop: StickyScene con scrub (sin GSAP). Mobile o reduced-motion:
 * tres bloques apilados, cada uno con su cuadro de la animacion.
 */

const STEPS = [
  {
    n: "01",
    title: "Elegí tu rubro.",
    body: "Cada negocio es distinto. Decinos el tuyo — clínica dental, comercio, servicios — y Onia se configura para ese rubro: sus fichas, su agenda, su forma de cobrar. No es una plantilla genérica que tenés que domar.",
  },
  {
    n: "02",
    title: "Tu cuenta queda lista.",
    body: "Sin instalación, sin proyecto de meses. La cuenta se arma con lo esencial de tu rubro ya configurado: agenda, clientes, cobros, facturación. Hoy la dejamos lista con vos, en una llamada.",
  },
  {
    n: "03",
    title: "Encendé módulos cuando los necesites.",
    body: "Empezá con lo básico y crecé sin cambiar de sistema: el chatbot de WhatsApp, tu página web, los agentes con IA, las automatizaciones — cada uno es un interruptor en tu cuenta, no una compra de software nueva.",
  },
] as const;

const RUBROS = ["Dental", "Comercio", "Servicios", "Proveedores"] as const;
const BLOCKS = ["Agenda", "Clientes", "Cobros", "Factura"] as const;

/** Paso 1: el selector de rubro elige "Dental" y el rubro se acopla al tablero. */
function RubroScene({ active }: { active: boolean }) {
  return (
    <div className={styles.rubroRow}>
      {RUBROS.map((r, i) => (
        <m.span
          key={r}
          className={`${styles.rubroChip} ${r === "Dental" && active ? styles.rubroChipOn : ""}`}
          initial={false}
          animate={{
            opacity: active ? (r === "Dental" ? 1 : 0.45) : 0.8,
            scale: active && r === "Dental" ? 1.06 : 1,
          }}
          transition={{ ...springs.snappy, delay: active ? i * 0.05 : 0 }}
        >
          {r}
        </m.span>
      ))}
    </div>
  );
}

/** Paso 2: los bloques de la cuenta se ensamblan en cascada y "encajan". */
function AssembleScene({ active }: { active: boolean }) {
  return (
    <div className={styles.blocks}>
      {BLOCKS.map((b, i) => (
        <m.div
          key={b}
          className={styles.block}
          initial={false}
          animate={
            active
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 22, scale: 0.96 }
          }
          transition={{ ...springs.heavy, delay: active ? i * 0.13 : 0 }}
        >
          <span className={styles.blockDot} />
          {b}
        </m.div>
      ))}
    </div>
  );
}

/** Paso 3: fila de interruptores; el Chatbot se enciende y aparece la burbuja. */
function TogglesScene({ active }: { active: boolean }) {
  return (
    <div className={styles.togglesArea}>
      <div className={styles.togglesRow}>
        <span className={styles.toggleLabel}>
          <DisplayToggle on={active} small />
          Chatbot WhatsApp
        </span>
        <span className={`${styles.toggleLabel} ${styles.toggleDim}`}>
          <DisplayToggle on={false} small />
          Página web
        </span>
        <span className={`${styles.toggleLabel} ${styles.toggleDim}`}>
          <DisplayToggle on={false} small />
          Automatizaciones
        </span>
      </div>
      <m.div
        className={styles.chatBubble}
        initial={false}
        animate={
          active
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 12, scale: 0.9 }
        }
        transition={{ ...springs.gentle, delay: active ? 0.4 : 0 }}
      >
        Hola, soy el asistente de la clínica. ¿Te agendo?
      </m.div>
    </div>
  );
}

/** La maqueta completa; recibe hasta que paso esta "vivo" (acumulativo). */
function Maquette({ step }: { step: number }) {
  return (
    <div className={styles.maquette} aria-hidden>
      <div className={styles.maquetteHead}>
        <span className={styles.maquetteTitle}>Tu cuenta Onia</span>
        <m.span
          className={styles.maquetteRubro}
          initial={false}
          animate={{ opacity: step >= 0 ? 1 : 0 }}
        >
          Rubro: Dental
        </m.span>
      </div>
      <RubroScene active={step >= 0} />
      <AssembleScene active={step >= 1} />
      <TogglesScene active={step >= 2} />
    </div>
  );
}

/** Contenido del sticky frame: lee el progreso y reparte el paso activo. */
function StickyStage() {
  const progress = useSceneProgress();
  const [step, setStep] = useState(0);

  useMotionValueEvent(progress, "change", (v) => {
    const next = v < 0.36 ? 0 : v < 0.72 ? 1 : 2;
    setStep((prev) => (prev === next ? prev : next));
  });

  return (
    <div className={`container ${styles.stageGrid}`}>
      <ol className={styles.stepList}>
        {STEPS.map((s, i) => (
          <li
            key={s.n}
            className={`${styles.step} ${i === step ? styles.stepActive : ""}`}
          >
            <span className={`mono ${styles.stepN}`}>{s.n}</span>
            <div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepBody}>{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <Maquette step={step} />
    </div>
  );
}

/** Variante apilada (mobile / reduced-motion): 3 bloques, cada uno su cuadro. */
function StackedStep({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const s = STEPS[index];

  return (
    <div ref={ref} className={styles.stackedItem}>
      <div className={`${styles.step} ${styles.stepActive}`}>
        <span className={`mono ${styles.stepN}`}>{s.n}</span>
        <div>
          <h3 className={styles.stepTitle}>{s.title}</h3>
          <p className={styles.stepBody}>{s.body}</p>
        </div>
      </div>
      <div className={styles.maquette} aria-hidden>
        {index === 0 ? <RubroScene active={inView} /> : null}
        {index === 1 ? <AssembleScene active={inView} /> : null}
        {index === 2 ? <TogglesScene active={inView} /> : null}
      </div>
    </div>
  );
}

export function HowItWorks() {
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const sticky = isDesktop && !reduced;

  return (
    <section id="como-funciona" className={`section ${styles.section}`}>
      <div className="container">
        <p className="kicker">Cómo funciona</p>
        <SplitTextReveal
          as="h2"
          className="h2"
          text="De cero a operando, en tres movimientos."
        />
      </div>

      {sticky ? (
        <StickyScene viewports={3} stickyClassName={styles.stickyFrame}>
          <StickyStage />
        </StickyScene>
      ) : (
        <div className={`container ${styles.stacked}`}>
          {STEPS.map((_, i) => (
            <StackedStep key={i} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
