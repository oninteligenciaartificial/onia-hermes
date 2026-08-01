import { cookies } from "next/headers";
import {
  filterOniaCenterRuntimeForActor,
  getMissingOniaCenterConfig,
  getOniaCenterRuntime,
  isOniaCenterConfigured,
} from "@/lib/onia-center-store";
import {
  canActorSeeFinance,
  canActorSeeScope,
  getOniaCenterActor,
  isSergio,
} from "@/lib/onia-center-auth";
import { formatBs } from "@/app/onia-center/engine";
import { sergioStrictScheduleBlocks } from "@/app/onia-center/operating-source";
import { getVisibleOperatingAgents } from "@/app/onia-center/operating-engine";
import {
  countActiveAgents,
  getLiveAgentStatuses,
  getFinanceSummary,
  getReviewBodies,
  mergeLiveAgentStatus,
  selectLiveInfoByAgentId,
} from "@/app/onia-center/live/live-runtime";
import { AppShell } from "@/app/onia-center/components/shell/AppShell";
import { HoyView } from "@/app/onia-center/components/views/hoy/HoyView";
import type { KpiItem } from "@/app/onia-center/components/views/hoy/KpiStrip";
import { EmptyState } from "@/app/onia-center/components/ui/EmptyState";

export const dynamic = "force-dynamic";

const OPEN_TASK_STATUS = new Set(["todo", "doing", "review", "blocked"]);

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

  const sergio = isSergio(auth.actor);
  const canSeeFinance = canActorSeeFinance(auth.actor);
  // Operación del equipo (tareas de todos): scope internal. seller/freelancer no.
  const canSeeTeamOps = canActorSeeScope(auth.actor, "internal_restricted");
  const canApprove = sergio;

  let runtimeReviews;
  let runtimeTasks;
  let runtimeLeads;
  let runtimeIdeas;
  try {
    const runtime = filterOniaCenterRuntimeForActor(await getOniaCenterRuntime(), auth.actor);
    runtimeReviews = runtime.reviews;
    runtimeTasks = runtime.tasks;
    runtimeLeads = runtime.leads;
    runtimeIdeas = runtime.ideas;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error leyendo Onia Center.";
    return (
      <AppShell canSeeFinance={canSeeFinance}>
        <EmptyState title="No se pudo cargar la cola de aprobacion" body={message} />
      </AppShell>
    );
  }

  const liveStatuses = await getLiveAgentStatuses();
  const visibleAgents = mergeLiveAgentStatus(getVisibleOperatingAgents(auth.actor.role), liveStatuses);
  const liveInfo = selectLiveInfoByAgentId(visibleAgents, liveStatuses);
  const activeAgents = countActiveAgents(visibleAgents, liveStatuses);
  const reviewBodies = await getReviewBodies();

  // Caja solo para roles con acceso a Finanzas; se lee aparte para no exponer
  // el dato financiero a un seller aunque llegue a esta vista.
  const summary = canSeeFinance ? await getFinanceSummary() : null;

  // KPIs reales, leidos en vivo y filtrados por el actor (leads/ideas/tareas ya
  // vienen recortados a lo que le corresponde). Aprobaciones solo para quien
  // aprueba; caja solo para Finanzas. Nada hardcodeado.
  const openLeads = runtimeLeads.filter((lead) => lead.status !== "ganado" && lead.status !== "perdido");
  const hotLeads = runtimeLeads.filter((lead) => lead.status === "reunion" || lead.status === "propuesta");
  const openTasks = runtimeTasks.filter((task) => OPEN_TASK_STATUS.has(task.status));
  const newIdeas = runtimeIdeas.filter((idea) => idea.status === "inbox" || idea.status === "queued");
  const meetings = runtimeLeads.filter(
    (lead) => lead.meetingStatus === "solicitada" || lead.meetingStatus === "confirmada",
  );

  // La "cola de aprobacion" se elimino de la vista (2026-08-01, pedido de
  // Sergio: 49 pendientes que nadie procesaba = ruido). El registro sigue en
  // review_queue para agentes/n8n; la UI muestra lo que se opera de verdad.
  const kpis: KpiItem[] = [];
  if (canApprove) {
    kpis.push({
      key: "reuniones",
      label: "Reuniones",
      value: String(meetings.length),
      hint: "solicitadas y confirmadas",
      tone: meetings.length > 0 ? "green" : "neutral",
    });
  }
  kpis.push({
    key: "leads",
    label: sergio ? "Leads abiertos" : "Mis leads",
    value: String(openLeads.length),
    hint: `de ${runtimeLeads.length} en total`,
    tone: "blue",
  });
  kpis.push({
    key: "pipeline",
    label: "En pipeline",
    value: String(hotLeads.length),
    hint: "reunión y propuesta",
    tone: "neutral",
  });
  if (!canApprove) {
    kpis.push({
      key: "tareas",
      label: "Mis tareas",
      value: String(openTasks.length),
      hint: "abiertas",
      tone: "neutral",
    });
  }
  kpis.push({
    key: "ideas",
    label: "Ideas nuevas",
    value: String(newIdeas.length),
    hint: "sin revisar",
    tone: "neutral",
  });
  kpis.push({
    key: "agentes",
    label: "Agentes activos",
    value: String(activeAgents),
    hint: "corriendo 24/7",
    tone: "green",
  });
  if (canSeeFinance && summary) {
    kpis.push({
      key: "caja",
      label: "Caja",
      value: formatBs(summary.cashTotalBs, { compact: true }),
      hint: "acumulada",
      tone: "green",
    });
  }

  return (
    <AppShell canSeeFinance={canSeeFinance} actorName={auth.actor.displayName}>
      <HoyView
        agents={visibleAgents}
        liveInfo={liveInfo}
        kpis={kpis}
        reviews={runtimeReviews}
        reviewBodies={reviewBodies}
        canApprove={canApprove}
        showTeam={canSeeTeamOps}
        showSchedule={sergio}
        headline={
          sergio
            ? undefined
            : "Tu día de un vistazo: tus leads, tus tareas y los agentes que trabajan por vos."
        }
        tasks={runtimeTasks}
        scheduleBlocks={sergio ? sergioStrictScheduleBlocks : []}
        referenceDate={new Date()}
      />
    </AppShell>
  );
}
