import { Marquee } from "@/motion";
import styles from "./v2.module.css";

/**
 * 2. BANDA DE MEDIA — un solo mensaje: esto es el producto, no un render.
 *
 * Leyes aplicadas:
 *  · §5/§7 → marquesina `35s linear infinite`, el ÚNICO movimiento largo de la
 *    página, y ambiental (no es un evento). Componente existente <Marquee>,
 *    que ya hace el translateX(0 → -50%) con el contenido duplicado.
 *  · §3 (el hallazgo grande) → densidad de MEDIA. Fanvue mete 132 imágenes;
 *    nosotros no vamos a fabricar 132, pero sí ponemos todas las que existen
 *    DE VERDAD en vez de mockups dibujados.
 *
 * Regla de la casa que manda acá: la marquesina de prueba social se usa "solo
 * con material REAL (capturas del producto), nunca logos inventados". Cero
 * clientes pagando ⇒ cero logos, cero testimonios. Lo que desfila son
 * pantallas de producción, y el pie dice que las cuentas están vacías.
 */

type Pieza = {
  src: string;
  alt: string;
  alta?: boolean;
};

const PIEZAS: readonly Pieza[] = [
  {
    src: "/v2/panel-comercio.webp",
    alt: "Panel de un negocio de comercio en Onia: cobrado de hoy, cómo te pagaron, cuadre de caja y fiados.",
  },
  {
    src: "/v2/bot-saludo.webp",
    alt: "El chatbot de Onia saludando en el chat de un cliente y ofreciendo horarios, servicios o hablar con una persona.",
    alta: true,
  },
  {
    src: "/v2/panel-agentes.webp",
    alt: "Pantalla de Agentes de Onia: Recall y Cobrador activos, con el aviso de que nunca envían solos.",
  },
  {
    src: "/v2/panel-contabilidad.webp",
    alt: "Módulo de contabilidad de Onia: IVA 13 %, IT 3 %, libro de ventas interno y conciliación de pagos.",
  },
  {
    src: "/v2/bot-pedido.webp",
    alt: "El chatbot de Onia tomando un pedido y derivándolo al dueño por el mismo chat.",
    alta: true,
  },
  {
    src: "/v2/panel-dental.webp",
    alt: "Panel del dueño en Onia con agenda de hoy, cobrado del mes, stock crítico y prioridades.",
  },
];

export function BandaV2() {
  return (
    <section className={styles.banda} aria-labelledby="v2-banda">
      <div className={styles.container}>
        <div className={styles.bandaCabeza}>
          <h2 id="v2-banda">Esto es el producto, no un render.</h2>
          <p className={styles.nota}>
            Seis capturas de producción, tomadas de cuentas de prueba nuestras.
            Están casi vacías a propósito: todavía no tenemos clientes pagando y
            no vamos a inventar datos para que se vean llenas.
          </p>
        </div>
      </div>
      {/*
        La banda sangra a pantalla completa a propósito: es la única cosa de la
        página que cruza el margen, y así se lee como una cinta y no como un
        carrusel dentro de una caja.
      */}
      <Marquee
        duration={35}
        className={styles.marquesina}
        trackClassName={styles.marquesinaTrack}
      >
        {PIEZAS.map((p) => (
          <div
            key={p.src}
            className={`${styles.tira} ${p.alta ? styles.tiraAlta : ""}`}
          >
            <div className={styles.marco}>
              {/* eslint-disable-next-line @next/next/no-img-element -- standalone sin optimizador */}
              <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
            </div>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
