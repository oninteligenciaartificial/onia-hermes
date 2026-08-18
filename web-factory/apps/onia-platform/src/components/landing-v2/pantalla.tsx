import styles from "./v2.module.css";

/**
 * Pantalla — una captura REAL del sistema dentro de su marco.
 *
 * Por qué existe: la diferencia grande entre la landing de Fanvue y la nuestra
 * no es la tipografía, es la DENSIDAD DE MEDIA (ellos: 132 imágenes y 10 videos
 * en una página; nosotros veníamos con maquetas dibujadas en HTML). Este
 * componente es el ladrillo de esa densidad, y obliga a declarar `pie`: cada
 * imagen dice exactamente qué es, para que ninguna pase por algo que no es.
 *
 * Sin cromo falso de navegador: los puntitos de macOS son el disfraz que se le
 * pone a un mockup. Estas son capturas de producción; no lo necesitan.
 *
 * `<img>` a secas y no next/image: el build es `output: standalone` sobre el
 * VPS, donde el optimizador de Next no corre (misma decisión y mismo motivo
 * que en src/components/landing/shot.tsx de la v1).
 */
export function Pantalla({
  src,
  srcMovil,
  alt,
  pie,
  ancho,
  alto,
  hover = true,
  className,
}: {
  src: string;
  /**
   * Recorte de la MISMA pantalla para telefono. Una captura de 1440 px
   * metida en 390 no se lee: se vuelve textura. Con <picture> el navegador
   * baja UNA sola de las dos, y el recorte muestra el trozo que importa a
   * tamano legible en vez de la pantalla entera en miniatura.
   */
  srcMovil?: string;
  alt: string;
  /** Qué es esta captura, dicho sin adorno. Obligatorio: es la regla de honestidad. */
  pie?: string;
  ancho: number;
  alto: number;
  hover?: boolean;
  className?: string;
}) {
  return (
    <figure className={className} style={{ margin: 0 }}>
      <div className={`${styles.marco} ${hover ? styles.marcoHover : ""}`}>
        <picture>
          {srcMovil ? (
            <source media="(max-width: 699px)" srcSet={srcMovil} />
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element -- standalone sin optimizador: mismo criterio que la v1 */}
          <img
            src={src}
            alt={alt}
            width={ancho}
            height={alto}
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
      {pie ? <figcaption className={styles.pie}>{pie}</figcaption> : null}
    </figure>
  );
}
