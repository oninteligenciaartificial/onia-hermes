import { Reveal } from "@/motion";
import { bs, PLANES, PRUEBA, GRUPO } from "@/lib/pricing";
import styles from "./v2.module.css";

/**
 * 6. PRECIOS — un solo mensaje: tres pasos, sin implementación.
 *
 * Leyes aplicadas:
 *  · 3 → el numeral va GRANDE y FINO (peso 380). Es el mismo principio del
 *    display llevado a la cifra: la magnitud sale del tamaño, nunca del bold.
 *  · 6 → las tarjetas son superficies por transparencia (`--v2-vidrio`), no
 *    grises opacos con borde duro. El plan recomendado rompe el patrón con
 *    tinta: jerarquía por profundidad, no por una pastilla de color.
 *  · 4-5 → resultado y lista al 75 %, en su propia medida.
 *
 * Los tres montos salen de src/lib/pricing.ts, que cita el código que cobra
 * (`lib/subscription-plans.ts → DEFAULT_PLAN_AMOUNTS`). Acá no vive ni un
 * número: si cambia el precio, cambia allá.
 *
 * Se muestran los 4 primeros renglones de `incluye` y el resto NO se borra:
 * vive completo en /precios, que es la página de la letra chica.
 */
export function PreciosV2() {
  return (
    <section
      className={`${styles.section} ${styles.precios}`}
      aria-labelledby="v2-precios"
    >
      <div className={styles.container}>
        <Reveal>
          <p className={styles.kicker}>Precios</p>
          <h2 id="v2-precios" className={`${styles.titulo} ${styles.medida}`}>
            Tres pasos. Sin implementación, sin migración.
          </h2>
          <p className={styles.lead}>
            El checkout cobra el plan y nada más. Pagás mensual o anual — el
            anual cobra diez meses y dos van de regalo.
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className={styles.planes}>
            {PLANES.map((plan) => (
              <div
                key={plan.id}
                className={`${styles.plan} ${
                  plan.destacado ? styles.planDestacado : ""
                }`}
              >
                <span className={styles.planPaso}>
                  {plan.paso} · {plan.salto}
                </span>
                <h3>{plan.nombre}</h3>
                <p className={styles.planPrecio}>
                  <span className={styles.planNumero}>{bs(plan.mensual)}</span>
                  <span className={styles.planUnidad}>Bs / mes</span>
                </p>
                <p className={styles.planResultado}>{plan.resultado}</p>
                <ul className={styles.planLista}>
                  {plan.incluye.slice(0, 4).map((linea) => (
                    <li key={linea}>{linea}</li>
                  ))}
                </ul>
                <div className={styles.planPie}>
                  <a className={styles.btn} href="/prueba-gratis">
                    Empezar con {plan.nombre}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className={styles.preciosPie}>
            <p className={styles.nota}>
              {PRUEBA.copy} {GRUPO.nombre}: Bs {bs(GRUPO.mensual)}/mes con
              implementación acompañada desde Bs {bs(GRUPO.implementacionDesde)} —
              no se compra en línea, se cotiza.
            </p>
            <a className={styles.link} href="/precios">
              Ver todo lo que lleva cada plan →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
