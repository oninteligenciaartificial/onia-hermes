import { AppShell } from "@/app/onia-center/components/shell/AppShell";
import { NegocioView } from "@/app/onia-center/components/views/negocio/NegocioView";

export const dynamic = "force-dynamic";

export default function NegocioPage() {
  return (
    <AppShell>
      <NegocioView />
    </AppShell>
  );
}
