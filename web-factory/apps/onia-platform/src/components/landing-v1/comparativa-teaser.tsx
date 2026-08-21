import { Reveal, SplitTextReveal, StaggerGrid, StaggerItem } from "@/motion";
import { CONTENDIENTES, EJES, FECHA_CONSULTA, HUECO } from "@/lib/proof";
import type { Estado } from "@/lib/proof";
import styles from "./landing.module.css";

const ESTADO_TXT: Record<Estado, string> = {
  si: "lo tiene",
  no: "no lo tiene",
  tramite: "en trámite",
};

/**
 * Comparativa — el teaser en el home de lo que vive completo en /comparativa.
 *
 * Una sola superficie de tinta con celdas de pelo (sin tarjetas): cada fila
 * un contendiente real con nombre propio, tres puntos de estado y su precio
 * publicado. El verde marca SOLO lo que funciona; lo nuestro en tramite va
 * punteado — la honestidad es la prueba, no un descargo en letra chica.
 *
 * Los datos salen ENTEROS de src/lib/proof.ts (fuente unica, con fecha de
 * consulta): aca no vive ningun numero ni ningun estado.
 */
export function ComparativaTeaser() {
  const onia = CONTENDIENTES.find((c) => c.esOnia);
  return (
    <section
      className={`${styles.section} ${styles.secTinta} ${styles.onDark}`}
      id="comparativa"
    >
      <div className={styles.container}>
        <span className={styles.kicker}>Comparación</span>
        <div style={{ marginTop: "0.5rem" }}>
          <SplitTextReveal
            as="h2"
            className={styles.sectionTitle}
            text="Contra lo que hoy se vende en Bolivia."
          />
        </div>
        <Reveal>
          <p className={styles.lead} style={{ marginTop: "1.1rem", maxWidth: "46ch" }}>
            {HUECO} Todos los precios son públicos: abrí cualquiera de esas
            webs y comprobalo.
          </p>
        </Reveal>

        <div className={styles.cmpTable}>
          <div className={styles.cmpHead} aria-hidden>
            <span />
            {EJES.map((eje) => (
              <span key={eje.id}>{eje.label}</span>
            ))}
            <span>Precio publicado</span>
          </div>

          <StaggerGrid stagger={0.07}>
            {CONTENDIENTES.map((c) => (
              <StaggerItem
                key={c.id}
                className={`${styles.cmpRow} ${c.esOnia ? styles.cmpOnia : ""}`}
              >
                <div className={styles.cmpQuien}>
                  <strong>{c.quien}</strong>
                  <span>{c.ejemplos}</span>
                </div>
                {EJES.map((eje) => (
                  <div
                    key={eje.id}
                    className={styles.cmpCell}
                    data-estado={c.estados[eje.id]}
                  >
                    <span className={styles.cmpDot} aria-hidden />
                    <span className={styles.cmpCellLabel} aria-hidden>
                      {eje.label}
                    </span>
                    <span className={styles.srOnly}>
                      {eje.label}: {ESTADO_TXT[c.estados[eje.id]]}
                    </span>
                  </div>
                ))}
                <div className={styles.cmpPrecio}>
                  <b className={styles.mono}>{c.precio}</b>
                  {c.precioNota ? <span>{c.precioNota}</span> : null}
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>

        <Reveal className={styles.cmpFoot}>
          {/* la fila punteada de Onia, explicada con nuestras palabras */}
          <p>{onia?.veredicto}</p>
          <a className={`${styles.btn} ${styles.btnGhost}`} href="/comparativa">
            Ver la comparación completa, con fuentes
          </a>
        </Reveal>
        <p className={styles.cmpFecha}>
          ● lo tiene · ○ no lo tiene · ◌ en trámite — precios consultados el{" "}
          {FECHA_CONSULTA}
        </p>
      </div>
    </section>
  );
}
