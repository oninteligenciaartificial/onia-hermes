import Link from "next/link";
import { WA_URL, APP_URL } from "@/lib/site";
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
            <Link href="/empezar" className="btn btn-ghost">
              Empezá ahora
            </Link>
            <a href={APP_URL} className="btn btn-ghost">
              Entrar a la app
            </a>
          </div>

          <p className={styles.micro}>
            Disponible hoy: <strong>DentalGest</strong>, para clínicas
            dentales — desde Bs 320/mes, precios de lanzamiento. Más rubros en
            camino.
          </p>
        </div>

        <HeroBoard />
      </div>
    </section>
  );
}
