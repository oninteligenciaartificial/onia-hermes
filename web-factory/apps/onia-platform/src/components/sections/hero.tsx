import Link from "next/link";
import { WA_URL } from "@/lib/site";
import { HeroBoard } from "./hero-board";
import styles from "./hero.module.css";

/**
 * Hero asimetrico 40/60: columna de texto angosta + escenario ancho con el
 * tablero insignia. El texto es 100% estatico (LCP primero: la promesa se
 * lee al instante); el que se mueve es el PRODUCTO, no el titular.
 */
export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.chip}>
            <span className={styles.chipDot} aria-hidden />
            Plataforma de gestión con IA · Hecha en Bolivia
          </p>

          <h1 className={styles.title}>
            Tu negocio completo.{" "}
            <span className={styles.titleAccent}>Un solo sistema.</span>
          </h1>

          <p className={styles.sub}>
            Onia maneja tu negocio de punta a punta: elegís tu rubro, tu
            cuenta queda lista, y encendés módulos a medida que los necesitás
            — agenda, cobros, facturación, y agentes con IA que trabajan las
            24 horas y no mueven un dedo sin tu aprobación.
          </p>

          <div className={styles.ctas}>
            <a href={WA_URL} className="btn btn-wa">
              <span className="btn-dot" aria-hidden />
              Hablanos por WhatsApp
            </a>
            <a href="#precios" className="btn btn-ghost">
              Ver planes y precios
            </a>
            <Link href="/empezar" className="btn btn-ghost">
              Empezá solo
            </Link>
          </div>

          <p className={styles.micro}>
            Disponible hoy: el <strong>pack dental</strong>, para clínicas y
            consultorios — desde Bs 320/mes, precio de lanzamiento y publicado.
            El siguiente pack es importadora.
          </p>
        </div>

        <HeroBoard />
      </div>
    </section>
  );
}
