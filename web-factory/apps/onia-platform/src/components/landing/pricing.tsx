import { CountUp, Reveal } from "@/motion";
import { APP_URL } from "@/lib/site";
import styles from "./landing.module.css";

const REGISTRO_URL = `${APP_URL}/register`;

/**
 * Precios — 3 planes simples, en bolivianos y publicados. La letra chica
 * existe entera, pero PLEGADA: nada se elimina, se pliega.
 *
 * Los numeros son los de lanzamiento vigentes (CLAUDE.md §propuestas 7 y
 * PRICING_RATIONALE_INTERNO.md §0). Si cambian, cambian ahi primero.
 */
export function Pricing() {
  return (
    <section className={`${styles.section} ${styles.secDeep}`} id="precios">
      <div className={styles.container}>
        <Reveal>
          <span className={styles.kicker}>Precios</span>
          <h2 className={styles.sectionTitle} style={{ marginTop: "0.5rem" }}>
            Precios en bolivianos, publicados acá.
          </h2>
        </Reveal>

        <div className={styles.plans}>
          <Reveal className={styles.plan}>
            <span className={styles.planStep}>01 · Ordenar</span>
            <h3>Básico</h3>
            <p className={styles.res}>Tu negocio deja de vivir en el cuaderno.</p>
            <p className={styles.price}>
              <CountUp value={320} className={`${styles.priceN} ${styles.mono}`} />
              <span className={styles.priceU}>Bs/mes</span>
            </p>
            <a className={`${styles.btn} ${styles.btnGhost}`} href={REGISTRO_URL}>
              Empezar
            </a>
          </Reveal>

          <Reveal delay={0.09} className={`${styles.plan} ${styles.planFeat}`}>
            <span className={styles.planFlag}>El recomendado</span>
            <span className={styles.planStep}>02 · Recuperar</span>
            <h3>Pro</h3>
            <p className={styles.res}>
              No se te escapa un cliente: el agente propone, vos aprobás.
            </p>
            <p className={styles.price}>
              <CountUp value={750} className={`${styles.priceN} ${styles.mono}`} />
              <span className={styles.priceU}>Bs/mes</span>
            </p>
            <a className={`${styles.btn} ${styles.btnPrimary}`} href={REGISTRO_URL}>
              Probar gratis 14 días
            </a>
            <span className={styles.guarantee}>
              Si al primer mes no te sirve, te devolvemos lo pagado.
            </span>
            <span className={styles.planAnnual}>Anual: 2 meses gratis</span>
          </Reveal>

          <Reveal delay={0.18} className={styles.plan}>
            <span className={styles.planStep}>03 · Automatizar</span>
            <h3>Full</h3>
            <p className={styles.res}>
              El negocio opera solo y vos decidís en vez de perseguir.
            </p>
            <p className={styles.price}>
              <CountUp value={1500} className={`${styles.priceN} ${styles.mono}`} />
              <span className={styles.priceU}>Bs/mes</span>
            </p>
            <a className={`${styles.btn} ${styles.btnGhost}`} href={REGISTRO_URL}>
              Empezar
            </a>
          </Reveal>
        </div>

        <details className={styles.fine}>
          <summary>La letra chica</summary>
          <div className={styles.fineIn}>
            <div>
              <h4>Condiciones</h4>
              <ul>
                <li>Precio de lanzamiento, sostenido 12 meses para quien cierra ahora.</li>
                <li>Trimestral por QR, o anual con 2 meses de regalo.</li>
                <li>Migración e implementación en cero durante esta fase.</li>
                <li>Tus datos son tuyos: los exportás cuando quieras.</li>
              </ul>
            </div>
            <div>
              <h4>No incluye</h4>
              <ul>
                <li>Dominio y hosting de tu web (van a tu nombre).</li>
                <li>Comisión de la pasarela de pago.</li>
                <li>Créditos de IA por encima del uso incluido.</li>
                <li>Conversaciones de WhatsApp API sobre el cupo.</li>
              </ul>
            </div>
            <div>
              <h4>Nota fiscal</h4>
              <p>
                Nuestro emisor está en trámite de homologación ante el SIN.
                Mientras tanto facturás en el Portal Web del SIN, que es gratuito
                y cumple la ley. No cobramos por algo que todavía no anda.
              </p>
              <p style={{ marginTop: "0.8rem" }}>
                <a className={styles.fineLink} href="/comparativa">
                  Comparación con los demás sistemas →
                </a>
              </p>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
