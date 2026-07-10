import { cookies } from "next/headers";
import { getMissingOniaCenterConfig, isOniaCenterConfigured } from "@/lib/onia-center-store";
import { getOniaCenterActor } from "@/lib/onia-center-auth";
import { getFinanceSummary } from "@/app/onia-center/live/live-runtime";
import { AppShell } from "@/app/onia-center/components/shell/AppShell";
import { FinanzasView } from "@/app/onia-center/components/views/finanzas/FinanzasView";
import { EmptyState } from "@/app/onia-center/components/ui/EmptyState";

export const dynamic = "force-dynamic";

async function buildAuthRequest(): Promise<Request> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return new Request("https://onia-center.internal/onia-center/next/finanzas", {
    headers: { cookie: cookieHeader },
  });
}

export default async function FinanzasPage() {
  if (!isOniaCenterConfigured()) {
    return (
      <AppShell>
        <EmptyState
          title="Falta configurar Supabase"
          body={`ONIA Center necesita estas variables de entorno: ${getMissingOniaCenterConfig().join(", ")}.`}
        />
      </AppShell>
    );
  }

  const auth = await getOniaCenterActor(await buildAuthRequest());
  if (!auth.ok) {
    return (
      <AppShell>
        <EmptyState title="No se pudo verificar tu sesion" body={auth.message} />
      </AppShell>
    );
  }

  const summary = await getFinanceSummary();

  return (
    <AppShell>
      <FinanzasView role={auth.actor.role} summary={summary} />
    </AppShell>
  );
}
