import type { RuntimeLead, RuntimeNote, RuntimeTask, TeamMember } from "@/lib/onia-center-store";
import { EmptyState } from "../../ui/EmptyState";
import { CollaboratorsPanel } from "./CollaboratorsPanel";
import { ProjectsPanel } from "./ProjectsPanel";

interface NegocioViewProps {
  tasks?: RuntimeTask[];
  leads?: RuntimeLead[];
  notes?: RuntimeNote[];
  team?: TeamMember[];
}

export function NegocioView({ tasks, leads, notes, team }: NegocioViewProps) {
  return (
    <div className="grid gap-6">
      <header className="grid gap-1">
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Negocio</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Proyectos en marcha, el equipo y su carga, y el inventario que se está portando.
        </p>
      </header>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
        <ProjectsPanel />
        <CollaboratorsPanel tasks={tasks} leads={leads} notes={notes} team={team} />
      </div>
      <EmptyState
        title="Inventario se esta portando"
        body="El inventario (StockCam) todavia no tiene datos reales cargados. Cuando el carril Motor conecte la tabla de inventario, esta seccion se llena sola."
      />
    </div>
  );
}
