import { cookies } from "next/headers";
import {
  filterOniaCenterRuntimeForActor,
  getMissingOniaCenterConfig,
  getOniaCenterRuntime,
  isOniaCenterConfigured,
} from "@/lib/onia-center-store";
import { getOniaCenterActor } from "@/lib/onia-center-auth";
import { sergioStrictScheduleBlocks } from "@/app/onia-center/operating-source";
import { getVisibleOperatingAgents } from "@/app/onia-center/operating-engine";
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

  const runtime = filterOniaCenterRuntimeForActor(await getOniaCenterRuntime(), auth.actor);
  const visibleAgents = getVisibleOperatingAgents(auth.actor.role);

  return (
    <AppShell>
      <HoyView
        agents={visibleAgents}
        reviews={runtime.reviews}
        scheduleBlocks={sergioStrictScheduleBlocks}
        referenceDate={new Date()}
      />
    </AppShell>
  );
}
