import { CountUp, Reveal, SplitTextReveal } from "@/motion";
import { APP_URL } from "@/lib/site";
import {
  ADDONS,
  CONDICIONES,
  GRUPO,
  NO_INCLUYE,
  NOTA_FISCAL,
  PLANES,
  PRUEBA,
  bs,
} from "@/lib/pricing";
import styles from "./landing.module.css";

const REGISTRO_URL = `${APP_URL}/register`;

/**
 * Precios — 3 planes, en bolivianos, y CADA UNO dice qué lleva con los números
 * que el sistema aplica de verdad (usuarios, fichas, recordatorios). La letra
 * chica existe entera, pero PLEGADA: nada se elimina, se pliega.
 *
 * Ningún monto vive acá: todos salen de src/lib/pricing.ts, que a su vez está
 * verificado contra el código que cobra. Si cambia un precio, cambia ahí.
 */
export function Pricing({ sinEncabezado = false }: { sinEncabezado?: boolean }) {
  return (
    <section className={`${styles.section} ${styles.secDeep}`} id="precios">
      <div className={styles.container}>
        {/* En /precios la pagina ya trae su propio h1 — el encabezado interno
            se silencia para no decir "precios" dos veces seguidas. */}
        {!sinEncabezado && (
          <>
            <Reveal>
              <span className={styles.kicker}>Precios</span>
            </Reveal>
            <div style={{ marginTop: "0.5rem" }}>
              <SplitTextReveal
                as="h2"
                className={styles.sectionTitle}
                text="Precios en bolivianos, publicados acá."
              />
            </div>
          </>
        )}

        <div className={styles.plans}>
          {PLANES.map((plan, i) => (
            <Reveal
              key={plan.id}
              delay={i * 0.09}
              className={`${styles.plan} ${plan.destacado ? styles.planFeat : ""}`}
            >
              {plan.destacado && (
                <span className={styles.planFlag}>El recomendado</span>
              )}
              <span className={styles.planStep}>
                {plan.paso} · {plan.salto}
              </span>
              <h3>{plan.nombre}</h3>
              <p className={styles.res}>{plan.resultado}</p>
              <p className={styles.price}>
                <CountUp
                  value={plan.mensual}
                  className={`${styles.priceN} ${styles.mono}`}
                />
                <span className={styles.priceU}>Bs/mes</span>
              </p>
              <p className={styles.planCiclos}>
                {plan.semanal
                  ? `o Bs ${bs(plan.semanal)}/semana · anual Bs ${bs(plan.anual)} (10 meses)`
                  : `anual Bs ${bs(plan.anual)} (10 meses) · este plan no se cobra semanal`}
              </p>

              <p className={styles.planListaTitulo}>Qué lleva</p>
              {/* 4 renglones clave a la vista; el resto se PLIEGA, no se borra
                  (la checklist de 8 items igualaba las tres tarjetas en una
                  pared de texto que nadie leia) */}
              <ul className={styles.planIncluye}>
                {plan.incluye.slice(0, 4).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {plan.incluye.length > 4 && (
                <details className={styles.planMore}>
                  <summary>Todo lo que lleva ({plan.incluye.length})</summary>
                  <ul>
                    {plan.incluye.slice(4).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </details>
              )}

              <p className={styles.planListaTitulo}>Qué no lleva</p>
              <ul className={styles.planSin}>
                {plan.sinEsto.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className={styles.planCuando}>{plan.cuando}</p>

              {/* Pie anclado al fondo (.planCta lleva margin-top:auto): las tres
                  tarjetas miden lo mismo y los tres botones quedan a la misma
                  altura, midan lo que midan las listas de arriba. La nota de la
                  prueba va ARRIBA del boton para no descolgarlo.

                  La nota la lleva CADA tarjeta, no sólo la destacada: el boton
                  de las tres arranca la misma prueba, que corre con el plan Pro
                  (TRIAL_PLAN del producto), asi que "este mismo plan" sólo es
                  cierto en una. El texto sale de PRUEBA.notaPorPlan — tipearlo
                  acá es como llegó a contradecir a su propia fuente. */}
              <div className={styles.planCta}>
                <span className={styles.guarantee}>{PRUEBA.notaPorPlan[plan.id]}</span>
                <a
                  className={`${styles.btn} ${plan.destacado ? styles.btnPrimary : styles.btnGhost}`}
                  href={REGISTRO_URL}
                >
                  {plan.destacado ? `Probar gratis ${PRUEBA.dias} días` : "Empezar"}
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <p className={styles.planGrupo}>
          <strong>{GRUPO.nombre}:</strong> Bs {bs(GRUPO.mensual)}/mes (anual Bs{" "}
          {bs(GRUPO.anual)}) + implementación desde Bs{" "}
          {bs(GRUPO.implementacionDesde)}. {GRUPO.copy}
        </p>

        <details className={styles.fine}>
          <summary>La letra chica</summary>
          <div className={styles.fineIn}>
            <div>
              <h4>Condiciones</h4>
              <ul>
                {CONDICIONES.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>No incluye</h4>
              <ul>
                {NO_INCLUYE.map((x) => (
                  <li key={x.que}>
                    <strong>{x.que}.</strong> {x.detalle}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Se suma aparte</h4>
              <ul>
                {ADDONS.map((a) => (
                  <li key={a.nombre}>
                    <strong>{a.nombre}</strong> — {a.precio}. {a.copy}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Nota fiscal</h4>
              <p>{NOTA_FISCAL}</p>
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
