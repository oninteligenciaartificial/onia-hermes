import { AppShell } from "@/app/onia-center/components/shell/AppShell";
import { EmptyState } from "@/app/onia-center/components/ui/EmptyState";

export default function PipelinePage() {
  return (
    <AppShell>
      <EmptyState
        title="Pipeline se esta portando"
        body="Leads y tareas todavia viven en el panel actual. Esta vista se conecta a los datos reales en la proxima etapa."
        linkHref="/onia-center"
        linkLabel="Ver leads y tareas en el panel actual"
      />
    </AppShell>
  );
}
