"use client";

import * as m from "motion/react-m";
import { Reveal, easeOutExpo, viewportOnce } from "@/motion";
import { PRUEBA } from "@/lib/pricing";
import { CONTENDIENTES, EJES, FECHA_CONSULTA, HUECO, TC_NOTA } from "@/lib/proof";
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
 *  2. Nuestro propio renglon, con la factura fiscal marcada como lo que es hoy
 *     (no la emite Onia: se emite en el Portal del SIN). Hasta el 2026-10-01
 *     decia EN TRAMITE; se saco por la regla «la venta nunca exhibe obra».
 *
 * ⚠️ Aca abajo vivia un tercer bloque —"Y esto todavia no lo hace.", las tres
 * lineas de TODAVIA_NO— y se saco el 2026-09-04. No es un cambio de opinion:
 * la decision ya estaba tomada y escrita en `(sitio)/comparativa/page.tsx`
 * ("la tercera anuncia obra en curso, que en una superficie de venta esta
 * prohibida"), y esta copia de /v1 quedo atras sirviendola con 200 —"el pack
 * del rubro se esta construyendo"— porque el arreglo se aplico solo donde el
 * defecto salto. Las dos lineas que si importan al que compra no se perdieron:
 * la fiscal vive en /facturacion y en el bloque fiscal de /precios, y el
 * veredicto de la fila de Onia dice donde se emite hoy la factura fiscal.
 * Lo sostiene `app/obra-en-el-cuerpo.test.ts`.
 *
 * Forma: un ledger de filas, no una grilla de cards. Cada fila es un
 * contendiente; los tres ejes se leen como una fila de senales encendidas o
 * apagadas — el verde ya es, en este sistema, el color de lo que esta vivo.
 */

function Marca({
  estado,
  label,
  alcance,
}: {
  estado: Estado;
  label: string;
  /** Hasta dónde llega en Onia. Sólo se pasa en nuestra fila (ver `EJES`). */
  alcance?: string | null;
}) {
  const texto = estado === "si" ? "sí" : "no";
  return (
    <span
      className={`${styles.marca} ${
        estado === "si" ? styles.marcaSi : styles.marcaNo
      }`}
    >
      <span className={styles.marcaSenal} aria-hidden />
      <span className={styles.marcaLabel}>
        {label}
        {estado === "si" && alcance ? (
          <span className={styles.marcaAlcance}> — {alcance}</span>
        ) : null}
      </span>
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
          <Marca
            key={e.id}
            estado={c.estados[e.id]}
            label={e.label}
            alcance={c.esOnia ? e.alcanceOnia : null}
          />
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
              en vez de leerlo, son {PRUEBA.dias} días con el plan{" "}
              {PRUEBA.planQueCorre} completo, sin tarjeta y sin permanencia.
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

      </div>
    </section>
  );
}
