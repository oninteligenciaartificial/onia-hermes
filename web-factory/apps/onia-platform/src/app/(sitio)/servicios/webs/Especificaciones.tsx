import { Reveal } from "@/motion";
import { CUIDADO_WEB, WEB_STACKS, precioWeb } from "@/content/webs";
import { Kicker } from "../../ui";
import s from "../../sitio.module.css";
import styles from "./webs.module.css";

/**
 * Pestaña «Más información» del configurador: las especificaciones exactas de
 * cada web —para quién, qué resuelve, qué incluye, qué NO incluye, qué ponés
 * vos y su Cuidado Web—, y la tabla de Cuidado Web.
 *
 * Sergio Urcullo, 2026-09-17: la página muestra SOLO el configurador tocable;
 * el detalle completo «que salga de una pestaña que diga más información». Es
 * el mismo bloque «Los stacks» que antes abría la página, movido acá. Los
 * montos siguen saliendo de src/content/webs.ts.
 */
export function Especificaciones() {
  return (
    <div className={styles.especificaciones}>
      <Reveal>
        <Kicker>Especificaciones</Kicker>
        <h3 className={s.h2}>
          Qué lleva cada web, qué no lleva y qué tenés que poner vos.
        </h3>
      </Reveal>
      <div className={styles.stacks}>
        {WEB_STACKS.map((stack) => (
          <Reveal
            key={stack.id}
            className={`${styles.stack} ${stack.destacado ? styles.stackFeat : ""}`}
          >
            <h4 className={styles.stackNombre}>{stack.nombre}</h4>
            <p className={styles.stackPrecio}>{precioWeb(stack)}</p>
            <p className={styles.stackLinea}>
              <strong>Para quién es.</strong> {stack.paraQuien}
            </p>
            <p className={styles.stackLinea}>
              <strong>Qué resuelve.</strong> {stack.resuelve}
            </p>

            <p className={styles.stackTitulo}>Qué incluye</p>
            <ul className={styles.lista}>
              {stack.incluye.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <p className={styles.stackTitulo}>Qué NO incluye</p>
            <ul className={styles.lista}>
              {stack.noIncluye.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <p className={styles.stackTitulo}>Qué necesitás vos</p>
            <ul className={styles.lista}>
              {stack.necesitasVos.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <p className={styles.stackMensual}>{stack.mensual}</p>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <Kicker>Después de publicarla</Kicker>
        <h3 className={s.h2}>Cuidado Web.</h3>
        <p className={s.body} style={{ maxWidth: "48em" }}>
          Una web que nadie toca envejece. El mensual es opcional y lo elegís
          vos. No incluye un panel para que edites: los cambios los hacemos
          nosotros, y cuántos entran por mes queda escrito en tu propuesta
          antes de arrancar.
        </p>
        <div className={styles.cuidado}>
          {CUIDADO_WEB.map((plan) => (
            <div key={plan.nombre} className={styles.cuidadoItem}>
              <p className={styles.cuidadoPrecio}>
                Bs {plan.mensual.toLocaleString("es-BO")}
                <span className={s.planUnit}> /mes</span>
              </p>
              <p className={styles.stackLinea} style={{ marginTop: "0.3rem" }}>
                <strong>{plan.nombre}.</strong> {plan.que}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
