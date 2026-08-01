"use client";

import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { useRef } from "react";
import type { KeyboardEvent } from "react";
import { Reveal, springs } from "@/motion";
import { useRubro } from "@/components/rubro-context";
import { waLink } from "@/lib/site";
import { RUBROS_PLANES, textoRubroEnConstruccion } from "@/lib/pricing";
import type { RubroId } from "@/lib/pricing";
import styles from "./rubros.module.css";

/**
 * Seccion c — el selector de rubros ES la animacion: al cambiar de pestaña
 * los bloques del rubro anterior se desacoplan y los del nuevo se ensamblan.
 * En los "proximamente" el ensamblaje queda a medio armar A PROPOSITO
 * (1 de 4 bloques): honestidad hecha animacion.
 *
 * El rubro elegido aca MANDA en la seccion de precios y en el mensaje de
 * WhatsApp de las puertas (contexto compartido) — el visitante dice quien es
 * una sola vez.
 *
 * Nunca presentar el pack dental como una marca aparte: Onia es UNA plataforma
 * y "dental" es su primer pack (ONIA_ENFOQUE_20260727 §4).
 */

type Detalle = {
  title: string;
  body: string;
  blocks: readonly string[];
  /** Cuantos bloques estan construidos de verdad (los demas van en fantasma). */
  built: number;
  micro?: string;
};

/**
 * Estado real por rubro — verificado contra
 * ONIA_PLATFORM_ESTRUCTURA_20260730.md §2/§3. El primer bloque de los rubros
 * en construccion es la base comun, que si existe; el resto, no.
 */
const DETALLE: Record<RubroId, Detalle> = {
  dental: {
    title: "Para clínicas y consultorios dentales.",
    body: "Agenda, historia clínica con odontograma, cobros y un agente que reprograma a los pacientes que te fallan. Es el primer pack de Onia y es el que está andando hoy.",
    blocks: ["Agenda", "Historia clínica", "Cobros y caja", "Agente que reprograma"],
    built: 4,
    micro: "Desde Bs 320/mes — precio de lanzamiento, con los tres planes publicados.",
  },
  proveedores: {
    title: "Para importadoras y distribuidoras.",
    body: "El segundo pack, arrancando por material eléctrico: pedidos, entregas, cuentas por cobrar y costeo de importación. La base ya da de alta la cuenta; las pantallas del rubro se están construyendo.",
    blocks: [
      "Cuenta y usuarios (base común)",
      "Pedidos y entregas",
      "Stock y cuentas por cobrar",
      "Costeo de importación",
    ],
    built: 1,
  },
  comercio: {
    title: "Para tiendas y comercios.",
    body: "Inventario, ventas y cobro con QR sobre el mismo motor que ya corre en dental. Todavía no tiene pantallas propias.",
    blocks: [
      "Cuenta y usuarios (base común)",
      "Inventario",
      "Ventas y cobro QR",
      "Facturación",
    ],
    built: 1,
  },
  servicios: {
    title: "Para negocios de servicios.",
    body: "Agenda de trabajos, presupuestos, seguimiento de clientes y cobros. Está en la fila, sobre el mismo motor.",
    blocks: [
      "Cuenta y usuarios (base común)",
      "Agenda de trabajos",
      "Presupuestos",
      "Cobros",
    ],
    built: 1,
  },
};

export function Rubros() {
  const { rubro, setRubro } = useRubro();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = RUBROS_PLANES.findIndex((r) => r.id === rubro);
  const meta = RUBROS_PLANES[active < 0 ? 0 : active];
  const detalle = DETALLE[meta.id];
  const disponible = meta.estado === "disponible";

  function onTabKey(e: KeyboardEvent<HTMLDivElement>) {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + RUBROS_PLANES.length) % RUBROS_PLANES.length;
    setRubro(RUBROS_PLANES[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <section id="rubros" className="section">
      <div className="container">
        <Reveal>
          <p className="kicker">Rubros</p>
          <h2 className="h2">Un sistema, tu rubro.</h2>
          <p className="lead">
            Onia no es un software genérico con tu logo encima. Cada rubro es un
            pack completo de la misma plataforma: lo que se agenda, lo que se
            cobra, lo que se factura. Esto es lo que hay hoy — sin humo.
          </p>
        </Reveal>

        <div
          role="tablist"
          aria-label="Rubros de Onia"
          className={styles.tabs}
          onKeyDown={onTabKey}
        >
          {RUBROS_PLANES.map((r, i) => (
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
              onClick={() => setRubro(r.id)}
            >
              {r.label}
              {r.estado !== "disponible" ? (
                <span className={styles.tabSoon}>pronto</span>
              ) : null}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${meta.id}`}
          aria-labelledby={`tab-${meta.id}`}
          className={styles.panel}
        >
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={meta.id}
              className={styles.panelGrid}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={springs.gentle}
            >
              <div className={styles.panelCopy}>
                <span className={`badge ${disponible ? "badge-on" : "badge-soon"}`}>
                  {disponible ? "DISPONIBLE" : "EN CONSTRUCCIÓN"}
                </span>
                <h3 className={styles.panelTitle}>{detalle.title}</h3>
                <p className={styles.panelBody}>{detalle.body}</p>
                <div className={styles.panelCtas}>
                  {disponible ? (
                    <>
                      <a href="#precios" className="btn btn-wa">
                        <span className="btn-dot" aria-hidden />
                        Ver los planes y precios
                      </a>
                      <a href="/empezar" className="btn btn-ghost">
                        Armar mi recomendación
                      </a>
                    </>
                  ) : (
                    <>
                      <a
                        href={waLink(textoRubroEnConstruccion(meta))}
                        className="btn btn-wa"
                      >
                        <span className="btn-dot" aria-hidden />
                        Hablemos de mi caso
                      </a>
                      <a href="#precios" className="btn btn-ghost">
                        Ver qué se puede hoy
                      </a>
                    </>
                  )}
                </div>
                <p className={styles.panelMicro}>
                  {detalle.micro ??
                    "Este rubro todavía no tiene precio publicado — no inventamos uno para llenar el cuadro."}
                </p>
              </div>

              {/* el ensamblaje: bloques construidos vs. fantasma */}
              <div className={styles.assembly} aria-hidden>
                {detalle.blocks.map((b, i) => {
                  const ghost = i >= detalle.built;
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
