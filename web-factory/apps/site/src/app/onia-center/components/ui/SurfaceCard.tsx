import type { ReactNode } from "react";

interface SurfaceCardProps {
  title?: string;
  /** Línea de contexto bajo el título (opcional; enriquece el header). */
  subtitle?: string;
  /** Slot alineado a la derecha del header, p. ej. un contador o pill (opcional). */
  action?: ReactNode;
  /** Barra inferior del panel, p. ej. una nota o un enlace "Ver más" (opcional). */
  footer?: ReactNode;
  /** Clases extra en el contenedor, p. ej. elevación en la vista Hoy (opcional). */
  className?: string;
  /** Clases del cuerpo. Por defecto `p-4`; pasar `""` o `p-0` para filas a sangre. */
  contentClassName?: string;
  children: ReactNode;
}

/**
 * Panel base del panel ONIA Center (registro producto). Reproduce el `.panel` del
 * mockup aprobado: superficie con hairline, header en barra con divisor inferior
 * (título 14px + subtítulo + acción) y un footer opcional. El mismo componente lo
 * usan todas las vistas para que el panel se sienta un solo producto: cuando solo
 * llega `title`, igual sale la barra de header consistente.
 */
export function SurfaceCard({
  title,
  subtitle,
  action,
  footer,
  className,
  contentClassName,
  children,
}: SurfaceCardProps) {
  const hasHeader = Boolean(title || subtitle || action);
  const body = contentClassName ?? "p-4";

  return (
    <section
      className={`overflow-hidden rounded-[var(--radius)] border border-border bg-card${className ? ` ${className}` : ""}`}
    >
      {hasHeader ? (
        <div className="flex items-start justify-between gap-3 border-b border-[color:var(--line-soft)] px-4 py-3.5">
          <div className="grid gap-1">
            {title ? (
              <h3 className="text-sm font-semibold tracking-[-0.01em] text-card-foreground">{title}</h3>
            ) : null}
            {subtitle ? <p className="text-xs leading-relaxed text-muted-foreground">{subtitle}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      <div className={body || undefined}>{children}</div>
      {footer ? (
        <div className="border-t border-[color:var(--line-soft)] px-4 py-3 text-center text-xs text-[color:var(--faint)]">
          {footer}
        </div>
      ) : null}
    </section>
  );
}
