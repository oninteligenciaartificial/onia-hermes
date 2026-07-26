"use client";

import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Reveal, springs } from "@/motion";
import {
  DENTALGEST_URL,
  WA_TEXT_COMERCIO,
  WA_TEXT_PROVEEDORES,
  WA_TEXT_SERVICIOS,
  WA_URL,
  waLink,
} from "@/lib/site";
import styles from "./rubros.module.css";

/**
 * Seccion c — el selector de rubros ES la animacion: al cambiar de pestaña
 * los bloques del rubro anterior se desacoplan y los del nuevo se ensamblan.
 * En los "proximamente" el ensamblaje queda a medio armar A PROPOSITO
 * (2 de 4 bloques): honestidad hecha animacion.
 */

type Rubro = {
  id: string;
  label: string;
  available: boolean;
  title: string;
  body: string;
  blocks: readonly string[];
  /** Cuantos bloques estan construidos de verdad (los demas van en fantasma). */
  built: number;
  ctaLabel: string;
  ctaHref: string;
  ctaSecondary?: { label: string; href: string };
  micro?: string;
};

const RUBROS: readonly Rubro[] = [
  {
    id: "dental",
    label: "Dental",
    available: true,
    title: "DentalGest — para clínicas y consultorios dentales.",
    body: "Agenda, historias clínicas, facturación y un agente que reprograma a los pacientes que te fallan. Es el primer rubro de Onia y ya está andando.",
    blocks: ["Agenda", "Historias clínicas", "Facturación", "Agente IA"],
    built: 4,
    ctaLabel: "Conocer DentalGest",
    ctaHref: DENTALGEST_URL,
    ctaSecondary: { label: "Hablanos por WhatsApp", href: WA_URL },
    micro: "Desde Bs 320/mes — precios de lanzamiento.",
  },
  {
    id: "comercio",
    label: "Comercio",
    available: false,
    title: "Para tiendas y comercios.",
    body: "Inventario, ventas, cobro con QR y facturación. Lo estamos construyendo sobre el mismo motor que ya corre en DentalGest.",
    blocks: ["Inventario", "Ventas", "Cobro QR", "Facturación"],
    built: 2,
    ctaLabel: "Anotate — te avisamos cuando esté",
    ctaHref: waLink(WA_TEXT_COMERCIO),
  },
  {
    id: "servicios",
    label: "Servicios",
    available: false,
    title: "Para negocios de servicios.",
    body: "Agenda de trabajos, presupuestos, seguimiento de clientes y cobros.",
    blocks: ["Agenda de trabajos", "Presupuestos", "Seguimiento", "Cobros"],
    built: 2,
    ctaLabel: "Anotate — te avisamos cuando esté",
    ctaHref: waLink(WA_TEXT_SERVICIOS),
  },
  {
    id: "proveedores",
    label: "Proveedores",
    available: false,
    title: "Para distribuidores y proveedores.",
    body: "Pedidos, entregas, cuentas por cobrar.",
    blocks: ["Pedidos", "Entregas", "Cuentas por cobrar", "Facturación"],
    built: 2,
    ctaLabel: "Anotate — te avisamos cuando esté",
    ctaHref: waLink(WA_TEXT_PROVEEDORES),
  },
] as const;

export function Rubros() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const rubro = RUBROS[active];

  function onTabKey(e: KeyboardEvent<HTMLDivElement>) {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + RUBROS.length) % RUBROS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section id="rubros" className="section">
      <div className="container">
        <Reveal>
          <p className="kicker">Rubros</p>
          <h2 className="h2">Un sistema, tu rubro.</h2>
          <p className="lead">
            Onia no es un software genérico con tu logo encima. Cada rubro es
            una configuración completa: lo que se agenda, lo que se cobra, lo
            que se factura. Esto es lo que hay hoy — sin humo.
          </p>
        </Reveal>

        <div
          role="tablist"
          aria-label="Rubros de Onia"
          className={styles.tabs}
          onKeyDown={onTabKey}
        >
          {RUBROS.map((r, i) => (
            <button
              key={r.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${r.id}`}
              aria-selected={i === active}
              aria-controls={`panel-${r.id}`}
              tabIndex={i === active ? 0 : -1}
              className={`${styles.tab} ${i === active ? styles.tabActive : ""}`}
              onClick={() => setActive(i)}
            >
              {r.label}
              {!r.available ? <span className={styles.tabSoon}>pronto</span> : null}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${rubro.id}`}
          aria-labelledby={`tab-${rubro.id}`}
          className={styles.panel}
        >
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={rubro.id}
              className={styles.panelGrid}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={springs.gentle}
            >
              <div className={styles.panelCopy}>
                <span
                  className={`badge ${rubro.available ? "badge-on" : "badge-soon"}`}
                >
                  {rubro.available ? "DISPONIBLE" : "PRÓXIMAMENTE"}
                </span>
                <h3 className={styles.panelTitle}>{rubro.title}</h3>
                <p className={styles.panelBody}>{rubro.body}</p>
                <div className={styles.panelCtas}>
                  <a href={rubro.ctaHref} className="btn btn-wa">
                    <span className="btn-dot" aria-hidden />
                    {rubro.ctaLabel}
                  </a>
                  {rubro.ctaSecondary ? (
                    <a href={rubro.ctaSecondary.href} className="btn btn-ghost">
                      {rubro.ctaSecondary.label}
                    </a>
                  ) : null}
                </div>
                {rubro.micro ? (
                  <p className={styles.panelMicro}>{rubro.micro}</p>
                ) : null}
              </div>

              {/* el ensamblaje: bloques construidos vs. fantasma */}
              <div className={styles.assembly} aria-hidden>
                {rubro.blocks.map((b, i) => {
                  const ghost = i >= rubro.built;
                  return (
                    <m.div
                      key={b}
                      className={`${styles.aBlock} ${ghost ? styles.aGhost : ""}`}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{
                        opacity: ghost ? 0.55 : 1,
                        y: 0,
                        scale: 1,
                      }}
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
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
