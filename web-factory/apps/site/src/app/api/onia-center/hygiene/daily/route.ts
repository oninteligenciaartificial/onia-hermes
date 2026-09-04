import { NextResponse } from "next/server";
import type { RoleId } from "@/app/onia-center/types";
import {
  createOniaCenterEntity,
  getMissingOniaCenterConfig,
  getOniaCenterRuntime,
  isOniaCenterConfigured,
  stripPlanPrefixes,
  type RuntimeSnapshot,
} from "@/lib/onia-center-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HygieneSeverity = "blocker" | "high" | "medium" | "low" | "info";
type HygieneCleanupLevel = "safe_auto" | "pull_request" | "approval_required" | "blocked";

type HygieneFinding = {
  id: string;
  source: string;
  projectId: string;
  severity: HygieneSeverity;
  cleanupLevel: HygieneCleanupLevel;
  approvalRequired: boolean;
  title: string;
  detail: string;
  recommendedAction: string;
  evidence?: string[];
};

type HygieneReport = {
  generatedAt: string;
  mode: string;
  totals?: {
    configuredProjects?: number;
    vercelProjects?: number;
    githubRepos?: number;
    cleanupCandidates?: number;
    findings?: number;
  };
  checkedSources?: string[];
  missingSecrets?: string[];
  findings?: HygieneFinding[];
};

type HygieneRequest = {
  commit?: boolean;
  report?: HygieneReport;
};

function getInternalKey() {
  return process.env.ONIA_CENTER_INTERNAL_API_KEY || process.env.ONIA_DAILY_BRIEFING_API_KEY || "";
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  if (authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim();
  }
  return request.headers.get("x-onia-internal-key") || "";
}

function unauthorized(message: string, status = 401) {
  return NextResponse.json({ ok: false, mode: "unauthorized", message, data: null }, { status });
}

function isAuthorized(request: Request) {
  const expected = getInternalKey();
  if (!expected) {
    return { ok: false as const, response: unauthorized("Falta ONIA_CENTER_INTERNAL_API_KEY para ejecutar higiene interna.", 503) };
  }

  const received = getBearerToken(request);
  if (!received || received !== expected) {
    return { ok: false as const, response: unauthorized("Automatizacion de higiene no autorizada.") };
  }

  return { ok: true as const };
}

function severityRank(severity: HygieneSeverity) {
  return { blocker: 5, high: 4, medium: 3, low: 2, info: 1 }[severity] ?? 0;
}

function projectIdForOniaCenter(projectId: string) {
  const map: Record<string, string> = {
    "onia-hermes": "project-onia-center",
    "onia-center": "project-onia-center",
    dentalgest: "project-dentagest",
    gestios: "project-gestios",
    "web-onia": "project-webs",
    websites: "project-webs",
    "bolivian-electric": "project-bolivian-os",
    "ganaderos-os": "project-onia-center",
  };

  return map[projectId] ?? "project-onia-center";
}

function riskForFinding(finding: HygieneFinding) {
  if (finding.severity === "blocker" || finding.severity === "high") {
    return "alto" as const;
  }
  if (finding.severity === "medium") {
    return "medio" as const;
  }
  return "bajo" as const;
}

function titleExists(snapshot: RuntimeSnapshot, title: string) {
  const base = stripPlanPrefixes(title);
  return (
    snapshot.tasks.some((task) => stripPlanPrefixes(task.title) === base) ||
    snapshot.notes.some((note) => stripPlanPrefixes(note.title) === base) ||
    snapshot.codexJobs.some((job) => stripPlanPrefixes(job.title) === base)
  );
}

function reportDate(report: HygieneReport) {
  const date = new Date(report.generatedAt);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
}

function summarizeReport(report: HygieneReport) {
  const findings = report.findings ?? [];
  const totals = report.totals ?? {};
  const blockers = findings.filter((finding) => finding.severity === "blocker").length;
  const high = findings.filter((finding) => finding.severity === "high").length;
  const cleanup = findings.filter((finding) => finding.cleanupLevel === "approval_required").length;
  return [
    `Fuentes revisadas: ${(report.checkedSources ?? []).join(", ") || "sin detalle"}.`,
    `Proyectos configurados: ${totals.configuredProjects ?? 0}. Vercel: ${totals.vercelProjects ?? 0}. GitHub: ${totals.githubRepos ?? 0}.`,
    `Hallazgos: ${findings.length}. Blockers: ${blockers}. Altos: ${high}. Candidatos a limpieza con aprobacion: ${cleanup}.`,
    report.missingSecrets?.length ? `Secrets faltantes: ${report.missingSecrets.join(", ")}.` : "Secrets criticos: sin faltantes reportados por el runner.",
    "Regla: no se elimina nada sin aprobacion Sergio. La automatizacion crea tareas y jobs revisables.",
  ].join("\n");
}

async function commitReport(report: HygieneReport, snapshot: RuntimeSnapshot) {
  const date = reportDate(report);
  const createdTasks = [];
  const createdNotes = [];
  const createdCodexJobs = [];
  const skipped = [];

  const noteTitle = "Higiene diaria: resumen proyectos Onia";
  if (!titleExists(snapshot, noteTitle)) {
    const note = await createOniaCenterEntity("note", {
      kind: "nota",
      title: noteTitle,
      detail: [`Reporte ${date}`, summarizeReport(report)].join("\n"),
      linkedTo: "onia-project-hygiene",
      actorRole: "sergio" as RoleId,
      visibility: "sergio_private",
      createdAt: new Date().toISOString(),
    });
    createdNotes.push(note);
  } else {
    skipped.push({ title: noteTitle, reason: "already_exists" });
  }

  const topFindings = [...(report.findings ?? [])]
    .sort((a, b) => severityRank(b.severity) - severityRank(a.severity))
    .slice(0, 12);

  for (const finding of topFindings) {
    const projectId = projectIdForOniaCenter(finding.projectId);
    const taskTitle = finding.title;

    if (titleExists(snapshot, taskTitle)) {
      skipped.push({ title: taskTitle, reason: "already_exists" });
      continue;
    }

    const task = await createOniaCenterEntity("task", {
      projectId,
      title: taskTitle,
      assignedRole: "sergio",
      status: "todo",
      priority: finding.severity === "blocker" || finding.severity === "high" ? "alta" : finding.severity === "medium" ? "media" : "baja",
      evidence: finding.recommendedAction,
      createdAt: new Date().toISOString(),
    });
    createdTasks.push(task);

    if (["blocker", "high", "medium"].includes(finding.severity) && finding.cleanupLevel !== "safe_auto") {
      const jobTitle = finding.title;
      const job = await createOniaCenterEntity("codex_job", {
        id: `hygiene-${date}-${finding.id}`.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 120),
        title: jobTitle,
        projectId,
        targetRepo: finding.projectId || "onia-hermes",
        requestType: finding.source === "github" ? "bugfix" : finding.cleanupLevel === "approval_required" ? "ops" : "audit",
        owner: "sergio",
        visibility: "sergio_private",
        risk: riskForFinding(finding),
        status: "draft",
        context: finding.detail,
        files: (finding.evidence ?? []).join("\n"),
        acceptance: "Hallazgo revisado, recurso clasificado y accion segura ejecutada o documentada.",
        validation: "Adjuntar evidencia: reporte de workflow, link Vercel/GitHub/Sentry, PR o decision de archivo.",
        evidence: finding.recommendedAction,
        createdAt: new Date().toISOString(),
      });
      createdCodexJobs.push(job);
    }
  }

  return { createdTasks, createdNotes, createdCodexJobs, skipped };
}

export async function POST(request: Request) {
  const authorization = isAuthorized(request);
  if (!authorization.ok) {
    return authorization.response;
  }

  if (!isOniaCenterConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        mode: "configuration_pending",
        message: "Onia Center necesita Supabase server-side antes de registrar higiene diaria.",
        missingConfiguration: getMissingOniaCenterConfig(),
        data: null,
      },
      { status: 200 },
    );
  }

  let payload: HygieneRequest = {};
  try {
    payload = (await request.json()) as HygieneRequest;
  } catch {
    return NextResponse.json({ ok: false, mode: "bad_request", message: "El cuerpo debe ser JSON valido.", data: null }, { status: 400 });
  }

  if (!payload.report || !Array.isArray(payload.report.findings)) {
    return NextResponse.json({ ok: false, mode: "bad_request", message: "report.findings es requerido.", data: null }, { status: 400 });
  }

  try {
    const snapshot = await getOniaCenterRuntime();
    const result = payload.commit ? await commitReport(payload.report, snapshot) : { createdTasks: [], createdNotes: [], createdCodexJobs: [], skipped: [] };

    return NextResponse.json({
      ok: true,
      mode: payload.commit ? "hygiene_committed" : "hygiene_dry_run",
      message: payload.commit ? "Higiene diaria registrada en Onia Center." : "Higiene diaria validada en modo prueba.",
      data: {
        generatedAt: payload.report.generatedAt,
        totals: payload.report.totals,
        topFindings: payload.report.findings.slice(0, 12),
      },
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo registrar higiene diaria.";
    return NextResponse.json({ ok: false, mode: "hygiene_error", message, data: null }, { status: 500 });
  }
}
