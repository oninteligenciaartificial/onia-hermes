import Link from "next/link";
import { WA_URL } from "@/lib/site";
import { GARANTIAS } from "@/lib/pricing";
import { HeroBoard } from "./hero-board";
import styles from "./hero.module.css";

/**
 * Hero. El titular manda a todo el ancho y debajo se abre en dos: la accion a
 * la izquierda, el producto andando a la derecha. Antes el titular vivia
 * dentro de la columna angosta y a 1440px se partia en seis lineas que
 * empujaban el boton fuera de la pantalla — la promesa se leia, pero no habia
 * donde tocar.
 *
 * El texto es 100% estatico (LCP primero: la promesa se lee al instante); el
 * que se mueve es el PRODUCTO, no el titular.
 *
 * Reglas de venta que manda este bloque:
 *  - El titular dice QUE GANA EL DUEÑO, no que es el producto. Antes decia
 *    "Tu negocio completo. Un solo sistema." — eso describe software; esto
 *    describe el resultado.
 *  - El argumento es "recuperas pacientes", NUNCA "ahorras horas": medido en
 *    horas el precio se ve caro (ONIA_PRICING_MODELO §4.2).
 *  - UN CTA principal, visible sin scrollear tanto en 375px como en 1440.
 *  - Las garantias van ACA ARRIBA, no enterradas: con cero clientes el freno
 *    es el riesgo, y se baja antes de que la persona lo formule.
 */
export function Hero() {
  return (
    <section id="inicio" className={styles.hero}>
      <div className={`container ${styles.grid}`}>
        <p className={styles.chip}>
          <span className={styles.chipDot} aria-hidden />
          Andando hoy: el pack dental · Hecho en Bolivia
        </p>

        <h1 className={styles.title}>
          Tu agenda llena.{" "}
          <span className={styles.titleAccent}>Sin perseguir a nadie.</span>
        </h1>

        <div className={styles.copy}>
          <p className={styles.sub}>
            Agenda, ficha del paciente y caja en el mismo lugar. Y cuando
            alguien te falla, Onia busca a quién mover a ese hueco y te deja el
            mensaje listo: vos aprobás con un toque.
          </p>

          <div className={styles.ctas}>
            <a href={WA_URL} className="btn btn-wa">
              <span className="btn-dot" aria-hidden />
              Hablemos por WhatsApp
            </a>
            <a href="#precios" className="btn btn-ghost">
              Ver precios
            </a>
          </div>

          {/* el riesgo, antes de que lo pregunten */}
          <ul className={styles.riesgo}>
            {GARANTIAS.slice(0, 3).map((g) => (
              <li key={g.corto} className={styles.riesgoItem}>
                <span className={styles.riesgoDot} aria-hidden />
                {g.corto}
              </li>
            ))}
          </ul>

          <p className={styles.micro}>
            Desde <strong>Bs 320/mes</strong>, precio de lanzamiento y
            publicado. Estamos arrancando y serías de las primeras clínicas —
            por eso el riesgo lo ponemos nosotros.{" "}
            <Link href="/empezar" className={styles.microLink}>
              O mirá solo, sin dejar datos
            </Link>
            .
          </p>
        </div>

        <HeroBoard />
      </div>
    </section>
  );
}
