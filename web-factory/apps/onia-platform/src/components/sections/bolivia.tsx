"use client";

import { Reveal, SplitTextReveal, StaggerGrid, StaggerItem } from "@/motion";
import { SiatScene } from "./siat-scene";
import styles from "./bolivia.module.css";

/**
 * Seccion e — el foso. Dos actos: (1) el bloque SIAT con la comparacion
 * honesta "tipear vs. no tipear" como protagonista; (2) franja de tres —
 * Bs, QR, offline. Compliance: el portal del SIN es gratis y se dice DE
 * FRENTE; el gancho es timing + cero doble trabajo, nunca miedo. Los datos
 * fiscales no bailan: fechas y montos van estaticos, sin count-up.
 */

const FRANJA = [
  {
    title: "En bolivianos.",
    body: "Precios en Bs, cobros en Bs, cuentas claras en la moneda en la que vivís. Sin sorpresas atadas al dólar del día.",
    tag: "Bs",
  },
  {
    title: "Pago con QR.",
    body: "El QR es como se paga en Bolivia. Onia lo integra en tus cobros para que pagar(te) sea un escaneo, no un trámite.",
    tag: "QR",
  },
  {
    title: "Funciona sin internet.",
    body: "Con el módulo local, tu operación sigue aunque la red no. Se sincroniza solita cuando vuelve la conexión.",
    tag: "OFF",
  },
] as const;

export function Bolivia() {
  return (
    <section id="bolivia" className={`section ${styles.section}`}>
      <div className="container">
        <Reveal>
          <p className="kicker">Hecho para Bolivia</p>
        </Reveal>
        <SplitTextReveal
          as="h2"
          className={`h2 ${styles.title}`}
          text="Los sistemas globales no facturan acá. Onia sí."
        />

        <div className={styles.siatGrid}>
          <div className={styles.siatCopy}>
            <Reveal>
              <p className={styles.siatLead}>
                Seamos claros: <strong>el portal del SIN es gratis</strong>, y
                podés cumplir la ley facturando ahí — tipeando cada factura,
                una por una, todos los días. Onia hace que{" "}
                <strong>no tengas que tipear</strong>: la factura sale sola del
                cobro que ya registraste en tu sistema. El mismo dato, cero
                doble trabajo.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className={styles.siatDeadline}>
                Y el calendario corre: desde el{" "}
                <strong className="mono">1 de octubre de 2026</strong> solo se
                factura en modalidad en línea. Dejalo resuelto con tiempo, no
                en la última semana.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className={styles.siatMicro}>
                La emisión en línea integrada se habilita según el estado de
                homologación de cada sistema ante el SIN — en la demo te
                decimos exactamente en qué punto está y qué te toca a vos
                (solo tus credenciales de Oficina Virtual).
              </p>
            </Reveal>
          </div>

          <Reveal from="right" className={styles.siatSceneWrap}>
            <SiatScene />
          </Reveal>
        </div>

        <StaggerGrid className={styles.franja} as="ul">
          {FRANJA.map((f) => (
            <StaggerItem key={f.tag} as="li" className={styles.franjaItem}>
              <span className={`mono ${styles.franjaTag}`}>{f.tag}</span>
              <h3 className={styles.franjaTitle}>{f.title}</h3>
              <p className={styles.franjaBody}>{f.body}</p>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
