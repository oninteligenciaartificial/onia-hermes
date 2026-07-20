import { cookies } from "next/headers";
import {
  filterOniaCenterRuntimeForActor,
  getOniaCenterRuntime,
  isOniaCenterConfigured,
  type RuntimeLead,
  type RuntimeNote,
  type RuntimeTask,
} from "@/lib/onia-center-store";
import { getOniaCenterActor } from "@/lib/onia-center-auth";
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

  // El scorecard del equipo usa datos reales del runtime. Si falta Supabase,
  // sesion o la lectura falla, el panel cae al roster estatico y el resto de la
  // vista Negocio (Proyectos) sigue funcionando.
  if (isOniaCenterConfigured()) {
    try {
      const auth = await getOniaCenterActor(await buildAuthRequest());
      if (auth.ok) {
        const runtime = filterOniaCenterRuntimeForActor(await getOniaCenterRuntime(), auth.actor);
        tasks = runtime.tasks;
        leads = runtime.leads;
        notes = runtime.notes;
      }
    } catch {
      // Lectura del runtime fallida: se mantiene el roster estatico.
    }
  }

  return (
    <AppShell>
      <NegocioView tasks={tasks} leads={leads} notes={notes} />
    </AppShell>
  );
}
