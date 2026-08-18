import { Reveal } from "@/motion";
import { NO_INCLUYE, NOTA_FISCAL } from "@/lib/pricing";
import styles from "./v2.module.css";

/**
 * 7. HONESTIDAD — segunda y última ANCLA OSCURA. Un solo mensaje: lo que
 * todavía no anda, te lo decimos acá.
 *
 * Por qué esta sección existe y no la tiene nadie más: los competidores de
 * Santa Cruz publican casos con números de resultado
 * (hermes-content/research/competencia/FORGES_SCZ.md). Nosotros no tenemos ni
 * un cliente pagando, así que fabricar un caso está prohibido — y quedarse
 * callado es perder el turno. La jugada es la inversa: publicar el límite.
 * Un proveedor que te dice de frente qué NO funciona todavía es más creíble
 * que uno que te muestra tres logos.
 *
 * Leyes aplicadas:
 *  · ancla oscura (§6 "NO se porta el fondo negro total") + celdas de pelo al
 *    15 % de transparencia.
 *  · 1-3 → el display gigante también acá: es un mensaje, no una disculpa en
 *    letra chica.
 *
 * Los textos son literales de src/lib/pricing.ts (NOTA_FISCAL, NO_INCLUYE):
 * la misma frase que ve quien está por pagar.
 */
export function HonestidadV2() {
  return (
    <section
      className={`${styles.section} ${styles.ancla}`}
      aria-labelledby="v2-honestidad"
    >
      <div className={styles.container}>
        <Reveal>
          <p className={styles.kicker}>Sin letra chica</p>
          <h2
            id="v2-honestidad"
            className={`${styles.display} ${styles.heroTitulo}`}
          >
            Lo que <em>todavía no</em> anda.
          </h2>
          <p className={styles.lead}>{NOTA_FISCAL}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className={styles.celdas}>
            {NO_INCLUYE.map((item) => (
              <div key={item.que} className={styles.celda}>
                <h3>{item.que}</h3>
                <p>{item.detalle}</p>
              </div>
            ))}
            <div className={styles.celda}>
              <h3>Clientes pagando</h3>
              <p>
                Cero, hoy. Por eso en esta página no vas a encontrar
                testimonios, logos ni casos con porcentajes: no existen. Lo que
                sí podés ver son las pantallas reales del sistema y probarlo
                gratis catorce días.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
