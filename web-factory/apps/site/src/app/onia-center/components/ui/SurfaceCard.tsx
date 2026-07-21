import type { ReactNode } from "react";

interface SurfaceCardProps {
  title?: string;
  /** Línea de contexto bajo el título (opcional; activa el header enriquecido). */
  subtitle?: string;
  /** Slot alineado a la derecha del header, p. ej. un contador (opcional). */
  action?: ReactNode;
  /** Clases extra en el contenedor, p. ej. elevación en la vista Hoy (opcional). */
  className?: string;
  children: ReactNode;
}

/**
 * Tarjeta base del panel nuevo. El render por defecto (solo `title`) se mantiene
 * idéntico para no alterar el resto de las vistas; `subtitle`/`action`/`className`
 * son aditivos y hoy solo los usa la vista "Hoy".
 */
export function SurfaceCard({ title, subtitle, action, className, children }: SurfaceCardProps) {
  const outerClassName = `rounded-lg border border-border bg-card p-5${className ? ` ${className}` : ""}`;
  const enhancedHeader = Boolean(subtitle || action);

  return (
    <div className={outerClassName}>
      {enhancedHeader ? (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="grid gap-1">
            {title ? <h3 className="text-base font-medium text-card-foreground">{title}</h3> : null}
            {subtitle ? (
              <p className="text-xs leading-relaxed text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : title ? (
        <h3 className="mb-3 text-base font-medium text-card-foreground">{title}</h3>
      ) : null}
      {children}
    </div>
  );
}
