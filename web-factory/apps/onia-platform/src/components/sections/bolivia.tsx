"use client";

import { Reveal, SplitTextReveal, StaggerGrid, StaggerItem } from "@/motion";
import { SiatScene } from "./siat-scene";
import styles from "./bolivia.module.css";

/**
 * Seccion e — el foso. Dos actos: (1) el bloque SIAT con la comparacion
 * honesta "tipear vs. no tipear" como protagonista; (2) franja de tres —
 * Bs, QR, nube. Compliance: el portal del SIN es gratis y se dice DE
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
    // CORREGIDO 2026-07-30: aca decia "funciona sin internet · modulo local".
    // Eso NO existe (ONIA_PLATFORM_ESTRUCTURA §3: Onia vive en la nube) y ademas
    // se contradecia con la respuesta honesta de la seccion de objeciones, en
    // la misma pagina. Se reemplaza por lo que si es cierto.
    title: "Se te cae el wifi y seguís.",
    body: "Onia vive en la nube: si el internet de la clínica falla, abrís desde el celular con datos y ahí está todo. Tus datos no viven en la PC del mostrador — si se quema o te la roban, no perdés nada.",
    tag: "NUBE",
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
                <strong>Y el estado real, sin vueltas:</strong> nuestro emisor
                está en trámite de homologación ante el SIN, así que hoy la
                factura fiscal la emitís vos en el Portal. Onia te deja el dato
                cerrado —paciente, monto, detalle— para no tipear dos veces, y
                cuando salga la homologación la factura sale del mismo sistema.
                No te cobramos por algo que todavía no anda.
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
