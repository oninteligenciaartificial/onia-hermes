import { EmptyState } from "../../ui/EmptyState";
import { CollaboratorsPanel } from "./CollaboratorsPanel";
import { ProjectsPanel } from "./ProjectsPanel";

export function NegocioView() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
        <ProjectsPanel />
        <CollaboratorsPanel />
      </div>
      <EmptyState
        title="Inventario se esta portando"
        body="El inventario (StockCam) todavia no tiene datos reales cargados. Cuando el carril Motor conecte la tabla de inventario, esta seccion se llena sola."
      />
    </div>
  );
}
