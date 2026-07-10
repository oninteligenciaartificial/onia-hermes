import { cookies } from "next/headers";
import {
  filterOniaCenterRuntimeForActor,
  getMissingOniaCenterConfig,
  getOniaCenterRuntime,
  isOniaCenterConfigured,
} from "@/lib/onia-center-store";
import { getOniaCenterActor } from "@/lib/onia-center-auth";
import { AppShell } from "@/app/onia-center/components/shell/AppShell";
import { PipelineView } from "@/app/onia-center/components/views/pipeline/PipelineView";
import { EmptyState } from "@/app/onia-center/components/ui/EmptyState";

export const dynamic = "force-dynamic";

async function buildAuthRequest(): Promise<Request> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return new Request("https://onia-center.internal/onia-center/next/pipeline", {
    headers: { cookie: cookieHeader },
  });
}

export default async function PipelinePage() {
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

  try {
    const runtime = filterOniaCenterRuntimeForActor(await getOniaCenterRuntime(), auth.actor);
    return (
      <AppShell>
        <PipelineView leads={runtime.leads} tasks={runtime.tasks} />
      </AppShell>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error leyendo ONIA Center.";
    return (
      <AppShell>
        <EmptyState title="No se pudo cargar el pipeline" body={message} />
      </AppShell>
    );
  }
}
