import { operatingVentures } from "@/app/onia-center/operating-source";
import type { CenterTone, VentureStatus } from "@/app/onia-center/types";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";

// Estado del venture -> tono semantico del panel. Verde = vivo, azul = en curso,
// ambar = necesita atencion, neutral = construido sin vender. Reusa los mismos
// tonos que Badge/KPIs para que el chip se lea igual en todo el panel.
const VENTURE_TONE: Record<VentureStatus, CenterTone> = {
  live: "green",
  in_progress: "blue",
  attention: "yellow",
  built: "neutral",
};

const liveCount = operatingVentures.filter((venture) => venture.status === "live").length;

// Grilla de ventures = torre de control del negocio. Un solo SurfaceCard con las
// celdas separadas por hairlines (mismo lenguaje que la franja de KPIs): NO son
// tarjetas anidadas, son celdas de una rejilla. Cada celda: nombre + rubro, chip
// de estado semantico, una linea de que es y el proximo paso concreto.
export function VenturesPanel() {
  return (
    <SurfaceCard
      title="Productos y ventures"
      subtitle="El estado real de cada frente ONIA: que esta vivo, que avanza y que necesita tu atencion."
      action={
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--accent-wash)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--accent-strong)]">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[color:var(--center-tone-green)]"
            aria-hidden="true"
          />
          {liveCount} vivos
        </span>
      }
      contentClassName=""
    >
      <ul className="grid gap-px bg-[color:var(--line-soft)] sm:grid-cols-2">
        {operatingVentures.map((venture) => (
          <li key={venture.id} className="grid content-start gap-2 bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="grid gap-0.5">
                <p className="text-sm font-semibold text-card-foreground">{venture.name}</p>
                <p className="text-xs text-muted-foreground">{venture.sector}</p>
              </div>
              <Badge tone={VENTURE_TONE[venture.status]}>{venture.statusLabel}</Badge>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{venture.summary}</p>
            <p className="text-xs leading-relaxed">
              <span className="font-medium text-card-foreground">Proximo: </span>
              <span className="text-muted-foreground">{venture.nextStep}</span>
            </p>
            {venture.url ? (
              <a
                href={`https://${venture.url}`}
                target="_blank"
                rel="noreferrer"
                className="justify-self-start text-xs font-medium text-primary hover:underline"
              >
                {venture.url}
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
}
