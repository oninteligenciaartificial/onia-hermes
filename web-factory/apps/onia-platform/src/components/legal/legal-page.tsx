import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Entrada } from "@/motion";
import { formatLegalDate, type LegalDoc } from "@/lib/legal";
import { LegalArticle } from "./legal-article";
import styles from "./legal-page.module.css";

/**
 * Pagina legal completa: hero sobrio + aviso de borrador + TOC + articulo.
 * El TOC se renderiza dos veces (aside sticky en desktop, <details> en
 * mobile); CSS decide cual se ve. Motion: una sola <Entrada> en el hero (CSS,
 * sin esperar JS: con el <Reveal> de motion el titular salia transparente del
 * servidor hasta hidratar) — el texto legal no se anima.
 */

function Toc({ doc }: { doc: LegalDoc }) {
  return (
    <ol className={styles.tocList}>
      {doc.toc.map((entry) => (
        <li key={entry.id}>
          <a href={`#${entry.id}`}>{entry.text}</a>
        </li>
      ))}
    </ol>
  );
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido" className={styles.main}>
        <div className="container">
          <Entrada>
            <header className={styles.hero}>
              <p className="kicker">Legal</p>
              <h1 className={styles.title}>{doc.meta.title}</h1>
              <p className={`mono ${styles.metaLine}`}>
                Plataforma Onia · Versión {doc.meta.version} · Actualizado el{" "}
                {formatLegalDate(doc.meta.updatedAt)}
              </p>
              {/* El aviso estaba HARDCODEADO: salia aunque el documento ya
                  estuviera vigente. Una politica de privacidad publicada como
                  "borrador" no sirve para publicar una app en Meta ni para
                  mostrarsela a una empresa. Ahora respeta el frontmatter. */}
              {doc.meta.status === "borrador" && (
                <div className={styles.draft} role="note">
                  <span className={styles.draftTag}>Borrador v{doc.meta.version}</span>
                  <p className={styles.draftText}>
                    Pendiente de revisión por abogado. Este documento es un
                    borrador de trabajo: no constituye asesoría legal y puede
                    cambiar antes de su versión definitiva.
                  </p>
                </div>
              )}
            </header>
          </Entrada>

          <div className={styles.layout}>
            <aside className={styles.tocDesktop} aria-label="Contenido">
              <p className={styles.tocTitle}>Contenido</p>
              <Toc doc={doc} />
            </aside>

            <details className={styles.tocMobile}>
              <summary className={styles.tocTitle}>Contenido</summary>
              <Toc doc={doc} />
            </details>

            <LegalArticle blocks={doc.blocks} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
