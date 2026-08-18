import { Reveal } from "@/motion";
import { Pantalla } from "./pantalla";
import styles from "./v2.module.css";

/**
 * 3. RUBROS — un solo mensaje: un sistema, once rubros.
 *
 * Leyes aplicadas:
 *  · §7 → columna izquierda `position: sticky` a secas (el patrón medido:
 *    `en-sticky` / `faq`). NO se usa <StickyScene>: ese ata el progreso al
 *    scroll y la ficha prohíbe el scrub.
 *  · 5   → el texto vive en su propia medida; la sección mide 1240 px.
 *  · 7   → gaps de 48–115 px entre las dos columnas.
 *
 * Los nombres son EXACTAMENTE los que publica la pantalla de registro y la
 * FAQ (misma lista que la v1). No hay marcas hermanas: DentalGest, GestiOS y
 * compañía son nombres viejos de lo que hoy es un pack — al cliente se le
 * nombra el rubro, nunca una marca aparte.
 */

const VIVOS = [
  ["Dental", "Agenda, tratamientos y fichas"],
  ["Comercio", "Caja, catálogo, fiados y stock"],
  ["Importadora", "Compras, proveedores y costos"],
  ["Estética", "Turnos, sesiones y paquetes"],
  ["Veterinaria", "Pacientes, controles y vacunas"],
  ["Servicios", "Órdenes, presupuestos y cobros"],
] as const;

const PRONTO = [
  "Gastronomía",
  "Construcción",
  "Educación",
  "Turismo",
  "Ganadería",
] as const;

const FOTOS = [
  ["/fotos/dentista.webp", "Odontóloga atendiendo en su consultorio."],
  ["/fotos/ferreteria.webp", "Mostrador de una ferretería."],
  ["/fotos/veterinaria.webp", "Veterinaria revisando a un animal."],
  ["/fotos/estetica.webp", "Sesión en un centro de estética."],
  ["/fotos/importadora.webp", "Depósito de una importadora."],
  ["/fotos/duena-telefono.webp", "Dueña de un negocio con el teléfono en la mano."],
] as const;

export function RubrosV2() {
  return (
    <section className={styles.section} aria-labelledby="v2-rubros">
      <div className={styles.container}>
        <div className={styles.rubrosGrid}>
          <div className={styles.rubrosAside}>
            <Reveal>
              <p className={styles.kicker}>Un solo sistema</p>
              <h2 id="v2-rubros" className={`${styles.titulo} ${styles.medidaCorta}`}>
                Elegís tu rubro y la cuenta ya viene armada.
              </h2>
              <p className={styles.lead}>
                No es un software distinto por industria: es el mismo núcleo con
                módulos y vocabulario propios. Un dentista ve pacientes y
                tratamientos; una ferretería ve productos y fiados.
              </p>
              <div className={styles.acciones}>
                <a className={styles.link} href="/modulos/dental">
                  Ver un rubro por dentro →
                </a>
              </div>
              <div className={styles.rubrosFotos}>
                {FOTOS.map(([src, alt]) => (
                  <span key={src} className={styles.foto}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- standalone sin optimizador */}
                    <img src={src} alt={alt} loading="lazy" decoding="async" />
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <ul className={styles.rubrosLista}>
                {VIVOS.map(([nombre, que]) => (
                  <li key={nombre} className={styles.rubroFila}>
                    <span className={styles.rubroEstado}>Vivo</span>
                    <span className={styles.rubroNombre}>{nombre}</span>
                    <span className={styles.rubroQue}>{que}</span>
                  </li>
                ))}
                {PRONTO.map((nombre) => (
                  <li
                    key={nombre}
                    className={`${styles.rubroFila} ${styles.rubroPronto}`}
                  >
                    <span className={styles.rubroEstado}>Viene</span>
                    <span className={styles.rubroNombre}>{nombre}</span>
                    <span className={styles.rubroQue}>Todavía no se vende</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.06}>
              <div style={{ marginTop: "var(--v2-gap-corto)" }}>
                <Pantalla
                  src="/capturas/rubros-onia.webp"
                  alt="Pantalla real del registro de Onia: la lista de rubros para elegir al crear la cuenta."
                  pie="Captura de producción · el selector de rubro al crear la cuenta"
                  ancho={1200}
                  alto={824}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
