import { cookies } from "next/headers";
import {
  filterOniaCenterRuntimeForActor,
  getMissingOniaCenterConfig,
  getOniaCenterRuntime,
  isOniaCenterConfigured,
} from "@/lib/onia-center-store";
import { getOniaCenterActor, isSergio } from "@/lib/onia-center-auth";
import { sergioStrictScheduleBlocks } from "@/app/onia-center/operating-source";
import { getVisibleOperatingAgents } from "@/app/onia-center/operating-engine";
import { getLiveAgentStatuses, getReviewBodies, mergeLiveAgentStatus } from "@/app/onia-center/live/live-runtime";
import { AppShell } from "@/app/onia-center/components/shell/AppShell";
import { HoyView } from "@/app/onia-center/components/views/hoy/HoyView";
import { EmptyState } from "@/app/onia-center/components/ui/EmptyState";

export const dynamic = "force-dynamic";

async function buildAuthRequest(): Promise<Request> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return new Request("https://onia-center.internal/onia-center/next/hoy", {
    headers: { cookie: cookieHeader },
  });
}

export default async function HoyPage() {
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

  let runtimeReviews;
  let runtimeTasks;
  try {
    const runtime = filterOniaCenterRuntimeForActor(await getOniaCenterRuntime(), auth.actor);
    runtimeReviews = runtime.reviews;
    runtimeTasks = runtime.tasks;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error leyendo ONIA Center.";
    return (
      <AppShell>
        <EmptyState title="No se pudo cargar la cola de aprobacion" body={message} />
      </AppShell>
    );
  }

  const liveStatuses = await getLiveAgentStatuses();
  const visibleAgents = mergeLiveAgentStatus(getVisibleOperatingAgents(auth.actor.role), liveStatuses);
  const reviewBodies = await getReviewBodies();

  return (
    <AppShell>
      <HoyView
        agents={visibleAgents}
        reviews={runtimeReviews}
        reviewBodies={reviewBodies}
        canApprove={isSergio(auth.actor)}
        tasks={runtimeTasks}
        scheduleBlocks={sergioStrictScheduleBlocks}
        referenceDate={new Date()}
      />
    </AppShell>
  );
}
