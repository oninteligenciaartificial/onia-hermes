import { cookies } from "next/headers";
import {
  filterOniaCenterRuntimeForActor,
  getMissingOniaCenterConfig,
  getOniaCenterRuntime,
  isOniaCenterConfigured,
  type RuntimeReview,
} from "@/lib/onia-center-store";
import { getOniaCenterActor } from "@/lib/onia-center-auth";
import { getVisibleOperatingAgents } from "@/app/onia-center/operating-engine";
import { getLiveAgentStatuses, mergeLiveAgentStatus } from "@/app/onia-center/live/live-runtime";
import { AppShell } from "@/app/onia-center/components/shell/AppShell";
import { AgentesView } from "@/app/onia-center/components/views/agentes/AgentesView";
import { EmptyState } from "@/app/onia-center/components/ui/EmptyState";

export const dynamic = "force-dynamic";

async function buildAuthRequest(): Promise<Request> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return new Request("https://onia-center.internal/onia-center/next/agentes", {
    headers: { cookie: cookieHeader },
  });
}

export default async function AgentesPage() {
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

  const liveStatuses = await getLiveAgentStatuses();
  const agents = mergeLiveAgentStatus(getVisibleOperatingAgents(auth.actor.role), liveStatuses);
  const lastRuns: Record<string, string | null> = {};
  for (const agent of agents) {
    lastRuns[agent.id] = liveStatuses[agent.id.replace(/-/g, "_")]?.lastRunAt ?? null;
  }

  let reviews: RuntimeReview[] = [];
  try {
    const runtime = filterOniaCenterRuntimeForActor(await getOniaCenterRuntime(), auth.actor);
    reviews = runtime.reviews;
  } catch {
    reviews = [];
  }

  return (
    <AppShell>
      <AgentesView agents={agents} lastRuns={lastRuns} reviews={reviews} />
    </AppShell>
  );
}
