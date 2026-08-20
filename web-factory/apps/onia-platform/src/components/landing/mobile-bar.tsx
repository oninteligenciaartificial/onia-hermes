import { WA_URL_LANDING } from "@/lib/site";
import styles from "./landing.module.css";

/**
 * Barra de accion del pulgar — solo movil (<900px).
 *
 * En el telefono el header deja solo el logo y un boton: sin esta barra,
 * "Precios" queda a un scroll a ciegas. El mockup la fija todo el recorrido
 * con las dos salidas del embudo, ver el precio y escribir.
 */
export function MobileBar() {
  return (
    <div className={styles.mobar}>
      <a className={`${styles.btn} ${styles.btnPrimary}`} href="#precios">
        Probar gratis
      </a>
      <a
        className={`${styles.btn} ${styles.btnGhost}`}
        href={WA_URL_LANDING}
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp
      </a>
    </div>
  );
}
