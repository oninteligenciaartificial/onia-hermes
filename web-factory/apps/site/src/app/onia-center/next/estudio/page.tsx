import { cookies } from "next/headers";
import { getMissingOniaCenterConfig, isOniaCenterConfigured } from "@/lib/onia-center-store";
import { canActorSeeFinance, getOniaCenterActor } from "@/lib/onia-center-auth";
import { AppShell } from "@/app/onia-center/components/shell/AppShell";
import { EstudioView } from "@/app/onia-center/components/views/estudio/EstudioView";
import { EmptyState } from "@/app/onia-center/components/ui/EmptyState";
import {
  getCutQueue,
  getEditorProjects,
  getHiggsfieldAccount,
  getStudioOverview,
} from "@/app/onia-center/components/views/estudio/source";

export const dynamic = "force-dynamic";

async function buildAuthRequest(): Promise<Request> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return new Request("https://onia-center.internal/onia-center/next/estudio", {
    headers: { cookie: cookieHeader },
  });
}

export default async function EstudioPage() {
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

  // Fase 1: los readers devuelven SEED (no DB). Mantienen la firma async para que
  // en Fase 2 se cambie el cuerpo por una lectura real sin tocar la vista.
  const [overview, projects, higgsfield, cutQueue] = await Promise.all([
    getStudioOverview(),
    getEditorProjects(),
    getHiggsfieldAccount(),
    getCutQueue(),
  ]);

  return (
    <AppShell canSeeFinance={canSeeFinance} actorName={auth.actor.displayName}>
      <EstudioView overview={overview} projects={projects} higgsfield={higgsfield} cutQueue={cutQueue} />
    </AppShell>
  );
}
