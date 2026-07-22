import type { RuntimeLead, RuntimeNote, RuntimeTask, TeamMember } from "@/lib/onia-center-store";
import type { ContentPipelineCounts } from "@/app/onia-center/live/live-runtime";
import { EmptyState } from "../../ui/EmptyState";
import { CollaboratorsPanel } from "./CollaboratorsPanel";
import { ContentPipelinePanel } from "./ContentPipelinePanel";
import { ProjectsPanel } from "./ProjectsPanel";
import { VenturesPanel } from "./VenturesPanel";

interface NegocioViewProps {
  tasks?: RuntimeTask[];
  leads?: RuntimeLead[];
  notes?: RuntimeNote[];
  team?: TeamMember[];
  /** Conteos del pipeline de contenido (idea_inbox + review_queue). Si falta, el bloque no se muestra. */
  content?: ContentPipelineCounts;
}

export function NegocioView({ tasks, leads, notes, team, content }: NegocioViewProps) {
  return (
    <div className="grid gap-6">
      <header className="grid gap-1">
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Negocio</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          El estado de cada producto y venture, los proyectos en marcha y el equipo con su carga.
        </p>
      </header>
      <VenturesPanel />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
        <ProjectsPanel />
        <CollaboratorsPanel tasks={tasks} leads={leads} notes={notes} team={team} />
        {content ? <ContentPipelinePanel counts={content} /> : null}
      </div>
      <EmptyState
        title="Inventario se esta portando"
        body="El inventario (StockCam) todavia no tiene datos reales cargados. Cuando el carril Motor conecte la tabla de inventario, esta seccion se llena sola."
      />
    </div>
  );
}
