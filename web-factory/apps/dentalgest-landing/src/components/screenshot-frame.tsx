interface ScreenshotFrameProps {
  title: string;
  /** Solo capturas REALES de DentalGest. Sin src => placeholder honesto. */
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * Marco de browser para screenshots reales del sistema.
 * Regla de la casa: nunca UI falsa hecha de divs. Mientras no haya
 * captura real, marco vacio con etiqueta "pendiente" (honesto > bonito).
 */
export function ScreenshotFrame({
  title,
  src,
  alt,
  width,
  height,
  priority = false,
}: ScreenshotFrameProps) {
  return (
    <figure className="shot-frame">
      <div className="shot-bar" aria-hidden="true">
        <span className="shot-dot" />
        <span className="shot-dot" />
        <span className="shot-dot" />
        <span className="shot-title">{title}</span>
      </div>
      <div className="shot-body">
        {src && width && height ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt ?? title}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
          />
        ) : (
          <div className="shot-pending">
            <span className="mono">Captura real del sistema — pendiente</span>
          </div>
        )}
      </div>
    </figure>
  );
}
