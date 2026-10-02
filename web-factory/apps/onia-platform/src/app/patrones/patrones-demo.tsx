"use client";

import {
  BleedWordmark,
  Coverflow,
  Marquee,
  MotionProvider,
  ScrollList,
  type CoverflowItem,
  type ScrollListItem,
} from "@/motion";
import styles from "./patrones.module.css";

/** Panel de rubro: en produccion aca va la captura real del sistema. */
function Panel({ title, lines }: { title: string; lines: readonly string[] }) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelBar}>
        <span className={styles.dot} />
        <span className={styles.panelTitle}>{title}</span>
      </div>
      <ul className={styles.panelList}>
        {lines.map((l) => (
          <li key={l}>
            <span className={styles.sq} aria-hidden="true" />
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

const RUBROS: readonly ScrollListItem[] = [
  {
    id: "dental",
    label: "Dental",
    panel: (
      <Panel
        title="Clínica · hoy"
        lines={[
          "6 recordatorios enviados",
          "2 facturas emitidas al SIAT",
          "1 paciente reactivado",
        ]}
      />
    ),
  },
  {
    id: "comercio",
    label: "Comercio",
    panel: (
      <Panel
        title="Ferretería · hoy"
        lines={["14 cotizaciones enviadas", "3 cobros recordados", "Stock crítico: 2 ítems"]}
      />
    ),
  },
  {
    id: "distribucion",
    label: "Distribución",
    panel: (
      <Panel
        title="Importadora · hoy"
        lines={["Costo puesto recalculado", "TC del día aplicado", "4 cotizaciones por vencer"]}
      />
    ),
  },
  {
    id: "taller",
    label: "Taller",
    panel: <Panel title="Taller · hoy" lines={["3 órdenes abiertas", "2 presupuestos aprobados"]} />,
  },
];

const CASOS: readonly CoverflowItem[] = [
  { id: "a", content: <div className={styles.card} data-i="1" />, caption: <><b>Ejemplo</b><span>Reservado para casos reales</span></> },
  { id: "b", content: <div className={styles.card} data-i="2" />, caption: <><b>Ejemplo</b><span>Reservado para casos reales</span></> },
  { id: "c", content: <div className={styles.card} data-i="3" />, caption: <><b>Ejemplo</b><span>Reservado para casos reales</span></> },
  { id: "d", content: <div className={styles.card} data-i="4" />, caption: <><b>Ejemplo</b><span>Reservado para casos reales</span></> },
];

export function PatronesDemo() {
  return (
    <MotionProvider>
      <main className={styles.main}>
        <header className={styles.head}>
          <p className={styles.kicker}>Web Factory</p>
          <h1 className={styles.h1}>Patrones de scroll</h1>
          <p className={styles.lead}>
            Cuatro componentes nuevos del kit. Scrolleá para verlos.
          </p>
        </header>

        <section className={styles.section}>
          <p className={styles.tag}>0 · Titular grande (.display)</p>
          <div className={styles.displayDemo}>
            <h2 className="display">
              Tu negocio, <em>ordenado</em>
            </h2>
            <p className={styles.displayNote}>
              Instrument Sans 600, tracking −2 %. Uno por pantalla, máximo 4-5 palabras.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.tag}>1 · Marquee</p>
          <Marquee className={styles.marquee} trackClassName={styles.marqueeTrack} duration={26}>
            {["SIAT", "WhatsApp", "QR Simple", "Agenda", "Facturación", "Agentes"].map((t) => (
              <span key={t} className={styles.chip}>
                {t}
              </span>
            ))}
          </Marquee>
        </section>

        <section className={styles.sectionDark}>
          <p className={styles.tag}>2 · ScrollList — el rubro cambia con el scroll</p>
          <ScrollList
            items={RUBROS}
            className={styles.scrollList}
            stickyClassName={styles.scrollSticky}
            listClassName={styles.scrollUl}
            panelClassName={styles.scrollPanel}
          />
        </section>

        <section className={styles.section}>
          <p className={styles.tag}>3 · Coverflow</p>
          <Coverflow
            items={CASOS}
            className={styles.cover}
            stageClassName={styles.coverStage}
            cardClassName={styles.coverCard}
            captionClassName={styles.coverCaption}
            controlsClassName={styles.coverControls}
          />
        </section>

        <section className={styles.sectionDark}>
          <p className={styles.tag}>4 · BleedWordmark</p>
          <BleedWordmark className={styles.bleed} />
        </section>
      </main>
    </MotionProvider>
  );
}
