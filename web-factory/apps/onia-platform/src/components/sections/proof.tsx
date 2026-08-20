"use client";

import * as m from "motion/react-m";
import { Reveal, easeOutExpo, viewportOnce } from "@/motion";
import {
  CONTENDIENTES,
  EJES,
  FECHA_CONSULTA,
  HUECO,
  TC_NOTA,
  TODAVIA_NO,
} from "@/lib/proof";
import type { Contendiente, Estado } from "@/lib/proof";
import styles from "./proof.module.css";

/**
 * Seccion "La prueba" — va TEMPRANO, antes de cualquier promesa larga.
 *
 * Prohibido inventar prueba social (clientes, logos, testimonios, metricas).
 * Y prohibido tambien lo contrario: PROCLAMAR la debilidad. La seccion no
 * anuncia que no hay clientes — muestra las dos cosas comprobables:
 *
 *  1. El mapa de la categoria con nombres y precios PUBLICOS de la competencia.
 *     El visitante puede abrir cada web y verificarlo. Ahi se ve el hueco: los
 *     que facturan no agendan, los que agendan no facturan en Bolivia.
 *  2. Nuestro propio renglon con la factura fiscal marcada EN TRAMITE, y un
 *     ledger de lo que el sistema todavia no hace. Decirlo primero es lo que
 *     hace creible todo lo demas: es un estado del producto, no una disculpa.
 *
 * Forma: un ledger de filas, no una grilla de cards. Cada fila es un
 * contendiente; los tres ejes se leen como una fila de senales encendidas o
 * apagadas — el verde ya es, en este sistema, el color de lo que esta vivo.
 */

function Marca({ estado, label }: { estado: Estado; label: string }) {
  const texto =
    estado === "si" ? "sí" : estado === "tramite" ? "en trámite" : "no";
  return (
    <span
      className={`${styles.marca} ${
        estado === "si"
          ? styles.marcaSi
          : estado === "tramite"
            ? styles.marcaTramite
            : styles.marcaNo
      }`}
    >
      <span className={styles.marcaSenal} aria-hidden />
      <span className={styles.marcaLabel}>{label}</span>
      <span className={`mono ${styles.marcaEstado}`}>{texto}</span>
    </span>
  );
}

function Fila({ c, i }: { c: Contendiente; i: number }) {
  return (
    <m.li
      className={`${styles.fila} ${c.esOnia ? styles.filaOnia : ""}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.5, ease: easeOutExpo, delay: i * 0.07 }}
    >
      <div className={styles.quienCol}>
        <h3 className={styles.quien}>{c.quien}</h3>
        <p className={`mono ${styles.ejemplos}`}>{c.ejemplos}</p>
      </div>

      <div className={styles.precioCol}>
        <p className={`mono ${styles.precio}`}>{c.precio}</p>
        {c.precioNota ? <p className={styles.precioNota}>{c.precioNota}</p> : null}
      </div>

      <div className={styles.marcas}>
        {EJES.map((e) => (
          <Marca key={e.id} estado={c.estados[e.id]} label={e.label} />
        ))}
      </div>

      <p className={styles.veredicto}>{c.veredicto}</p>
    </m.li>
  );
}

export function Proof() {
  return (
    <section id="prueba" className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.head}>
          <Reveal>
            <h2 className={`h2 ${styles.title}`}>
              No te pedimos que nos creas. Abrí las webs y comprobalo.
            </h2>
          </Reveal>
          <Reveal delay={0.08} className={styles.headAside}>
            <p className={styles.headLead}>
              Acá no hay testimonios: hay{" "}
              <strong>
                precios y capacidades publicados por cada proveedor
              </strong>
              , con nombre y fecha de consulta. Y si querés probar el nuestro
              en vez de leerlo, son 14 días con el sistema completo, sin
              tarjeta y sin permanencia.
            </p>
          </Reveal>
        </div>

        <Reveal className={styles.huecoWrap}>
          <p className={styles.hueco}>{HUECO}</p>
          <p className={styles.huecoPie}>
            Los que facturan al SIN no agendan. Los que agendan no facturan en
            Bolivia. Ese cruce es el lugar donde estamos.
          </p>
        </Reveal>

        <ul className={styles.ledger}>
          {CONTENDIENTES.map((c, i) => (
            <Fila key={c.id} c={c} i={i} />
          ))}
        </ul>

        <p className={styles.fuente}>
          Precios tal como los publica cada proveedor en su propia web,
          consultados el {FECHA_CONSULTA}. Los que publican en dólares se
          convirtieron a {TC_NOTA}. Ninguna cifra de este cuadro es nuestra.
        </p>

        <div className={styles.noWrap}>
          <Reveal className={styles.noHead}>
            <h3 className={styles.noTitle}>Y esto todavía no lo hace.</h3>
            <p className={styles.noLead}>
              Lo decimos nosotros primero. Si te enterás en la primera semana,
              perdimos los dos.
            </p>
          </Reveal>
          <ul className={styles.noLista}>
            {TODAVIA_NO.map((p, i) => (
              <m.li
                key={p.que}
                className={styles.noItem}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.45, ease: easeOutExpo, delay: i * 0.06 }}
              >
                <strong className={styles.noQue}>{p.que}</strong>
                <span className={styles.noDetalle}>{p.detalle}</span>
              </m.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
