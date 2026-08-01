import { cookies } from "next/headers";
import {
  filterOniaCenterRuntimeForActor,
  getMissingOniaCenterConfig,
  getOniaCenterRuntime,
  isOniaCenterConfigured,
  type RuntimeReview,
} from "@/lib/onia-center-store";
import {
  canActorSeeFinance,
  canActorSeeScope,
  getOniaCenterActor,
  isSergio,
} from "@/lib/onia-center-auth";
import type { VisibilityScope } from "@/app/onia-center/types";
import { getVisibleOperatingAgents } from "@/app/onia-center/operating-engine";
import {
  getAgentRunFeed,
  getIntegrationConnectors,
  getLiveAgentStatuses,
  mergeLiveAgentStatus,
  selectLiveInfoByAgentId,
} from "@/app/onia-center/live/live-runtime";
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
  const liveStatuses = await getLiveAgentStatuses();
  const agents = mergeLiveAgentStatus(getVisibleOperatingAgents(auth.actor.role), liveStatuses);
  const liveInfo = selectLiveInfoByAgentId(agents, liveStatuses);

  let reviews: RuntimeReview[] = [];
  try {
    const runtime = filterOniaCenterRuntimeForActor(await getOniaCenterRuntime(), auth.actor);
    reviews = runtime.reviews;
  } catch {
    reviews = [];
  }

  const integrations = await getIntegrationConnectors();

  // El feed de auditoria se filtra por sensibilidad: el motor marca cada evento
  // con sensitivity_scope; roles no-Sergio no ven eventos privados.
  const rawFeed = await getAgentRunFeed();
  const feed = rawFeed.filter((entry) =>
    canActorSeeScope(auth.actor, entry.sensitivityScope as VisibilityScope),
  );

  return (
    <AppShell canSeeFinance={canSeeFinance} actorName={auth.actor.displayName}>
      <AgentesView
        agents={agents}
        liveInfo={liveInfo}
        reviews={reviews}
        integrations={integrations}
        feed={feed}
        canTrigger={isSergio(auth.actor)}
      />
    </AppShell>
  );
}
