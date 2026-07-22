import type { ContentPipelineCounts } from "@/app/onia-center/live/live-runtime";
import { SurfaceCard } from "../../ui/SurfaceCard";

interface ContentPipelinePanelProps {
  counts: ContentPipelineCounts;
}

// Mini-bloque del pipeline de contenido: dos numeros reales leidos en vivo
// (idea_inbox + review_queue). Reusa el lenguaje numerico de la franja de KPIs
// (numero grande tabular + rotulo faint). Si no hay datos (Supabase sin
// configurar o lectura fallida) la vista Negocio no lo renderiza.
export function ContentPipelinePanel({ counts }: ContentPipelinePanelProps) {
  return (
    <SurfaceCard title="Contenido" subtitle="Pipeline en vivo: lo que espera revision." contentClassName="">
      <dl className="grid grid-cols-2 gap-px bg-[color:var(--line-soft)]">
        <Stat label="Ideas pendientes" value={counts.ideasPending} hint="Por revisar en el inbox" />
        <Stat label="Borradores" value={counts.draftsPending} hint="En cola de aprobacion" />
      </dl>
    </SurfaceCard>
  );
}

function Stat({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div className="grid content-start gap-1 bg-card p-4">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[color:var(--faint)]">
        {label}
      </dt>
      <dd className="text-[23px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-card-foreground">
        {value}
      </dd>
      <p className="text-[11.5px] leading-snug text-muted-foreground">{hint}</p>
    </div>
  );
}
