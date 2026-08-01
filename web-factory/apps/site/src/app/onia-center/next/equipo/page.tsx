import { cookies } from "next/headers";
import {
  filterOniaCenterRuntimeForActor,
  getMissingOniaCenterConfig,
  getOniaCenterRuntime,
  isOniaCenterConfigured,
} from "@/lib/onia-center-store";
import { canActorSeeFinance, getOniaCenterActor, isSergio } from "@/lib/onia-center-auth";
import { AppShell } from "@/app/onia-center/components/shell/AppShell";
import { EquipoView } from "@/app/onia-center/components/views/equipo/EquipoView";
import { EmptyState } from "@/app/onia-center/components/ui/EmptyState";

export const dynamic = "force-dynamic";

async function buildAuthRequest(): Promise<Request> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return new Request("https://onia-center.internal/onia-center/next/equipo", {
    headers: { cookie: cookieHeader },
  });
}

export default async function EquipoPage() {
  if (!isOniaCenterConfigured()) {
    return (
      <AppShell>
        <EmptyState
          title="Falta configurar Supabase"
          body={`Onia Center necesita estas variables de entorno: ${getMissingOniaCenterConfig().join(", ")}.`}
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

  const canSeeFinance = canActorSeeFinance(auth.actor);

  try {
    const runtime = filterOniaCenterRuntimeForActor(await getOniaCenterRuntime(), auth.actor);

    return (
      <AppShell canSeeFinance={canSeeFinance} actorName={auth.actor.displayName}>
        <EquipoView tasks={runtime.tasks} leads={runtime.leads} showMoney={isSergio(auth.actor)} />
      </AppShell>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error leyendo Onia Center.";
    return (
      <AppShell canSeeFinance={canSeeFinance}>
        <EmptyState title="No se pudo cargar la vista de equipo" body={message} />
      </AppShell>
    );
  }
}
