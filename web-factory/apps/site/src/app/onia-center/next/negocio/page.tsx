import { cookies } from "next/headers";
import {
  filterOniaCenterRuntimeForActor,
  getOniaCenterRuntime,
  getOniaCenterTeam,
  isOniaCenterConfigured,
  type RuntimeLead,
  type RuntimeNote,
  type RuntimeTask,
  type TeamMember,
} from "@/lib/onia-center-store";
import { canActorSeeFinance, getOniaCenterActor } from "@/lib/onia-center-auth";
import { AppShell } from "@/app/onia-center/components/shell/AppShell";
import { NegocioView } from "@/app/onia-center/components/views/negocio/NegocioView";

export const dynamic = "force-dynamic";

async function buildAuthRequest(): Promise<Request> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return new Request("https://onia-center.internal/onia-center/next/negocio", {
    headers: { cookie: cookieHeader },
  });
}

export default async function NegocioPage() {
  let tasks: RuntimeTask[] | undefined;
  let leads: RuntimeLead[] | undefined;
  let notes: RuntimeNote[] | undefined;
  let team: TeamMember[] | undefined;
  let canSeeFinance = true;
  let actorName: string | undefined;

  // Personas reales del equipo + scorecard con datos reales del runtime. Si
  // falta Supabase, sesion o la lectura falla, el panel cae al roster estatico y
  // el resto de la vista Negocio (Proyectos) sigue funcionando.
  if (isOniaCenterConfigured()) {
    // Roster real del equipo (service role, no depende de la sesion del usuario).
    try {
      const members = await getOniaCenterTeam();
      if (members.length > 0) {
        team = members;
      }
    } catch {
      // Lectura del equipo fallida: se mantiene el roster estatico.
    }

    // Scorecard: tareas, leads y notas reales, filtrados por el actor en sesion.
    try {
      const auth = await getOniaCenterActor(await buildAuthRequest());
      if (auth.ok) {
        canSeeFinance = canActorSeeFinance(auth.actor);
        actorName = auth.actor.displayName;
        const runtime = filterOniaCenterRuntimeForActor(await getOniaCenterRuntime(), auth.actor);
        tasks = runtime.tasks;
        leads = runtime.leads;
        notes = runtime.notes;
      }
    } catch {
      // Lectura del runtime fallida: se muestran las personas sin scorecard.
    }
  }

  return (
    <AppShell canSeeFinance={canSeeFinance} actorName={actorName}>
      <NegocioView tasks={tasks} leads={leads} notes={notes} team={team} />
    </AppShell>
  );
}
