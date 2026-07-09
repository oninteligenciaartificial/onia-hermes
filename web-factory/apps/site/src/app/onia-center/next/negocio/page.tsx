import { AppShell } from "@/app/onia-center/components/shell/AppShell";
import { EmptyState } from "@/app/onia-center/components/ui/EmptyState";

export default function NegocioPage() {
  return (
    <AppShell>
      <EmptyState
        title="Negocio se esta portando"
        body="Proyectos, colaboradores, inventario y organizaciones todavia viven en el panel actual. Esta vista se conecta a los datos reales en la proxima etapa."
        linkHref="/onia-center"
        linkLabel="Ver el detalle en el panel actual"
      />
    </AppShell>
  );
}
