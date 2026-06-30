#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));
const repoRoot = process.cwd();
const configPath = path.resolve(repoRoot, args.config || "hermes-content/references/onia-project-hygiene-config.json");
const outDir = path.resolve(repoRoot, args.out || ".onia-hygiene");
const commitToOniaCenter = parseBoolean(args.commit ?? process.env.ONIA_HYGIENE_COMMIT ?? "false");
const failOnBlocker = parseBoolean(args.failOnBlocker ?? process.env.ONIA_HYGIENE_FAIL_ON_BLOCKER ?? "false");

const startedAt = new Date();
let monitorOk = false;

try {
  const config = JSON.parse(await readFile(configPath, "utf8"));
  await notifyMonitor("in_progress", { configVersion: config.version });

  const report = await buildReport(config);
  report.oniaCenterCommit = {
    requested: commitToOniaCenter,
    attempted: false,
    ok: false,
    mode: "not_attempted",
    message: "ONIA Center commit not requested.",
  };

  if (commitToOniaCenter) {
    report.oniaCenterCommit = await postToOniaCenter(config, report);
  }

  await writeOutputs(report);

  const blockerCount = report.findings.filter((finding) => finding.severity === "blocker").length;
  const highCount = report.findings.filter((finding) => finding.severity === "high").length;

  if (blockerCount || highCount) {
    console.log(`ONIA hygiene completed with ${blockerCount} blockers and ${highCount} high-priority findings.`);
  } else {
    console.log("ONIA hygiene completed without high-priority findings.");
  }

  await notifyMonitor("ok", { blockers: blockerCount, high: highCount });

  if (failOnBlocker && blockerCount > 0) {
    process.exitCode = 2;
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`ONIA hygiene failed: ${message}`);
  await notifyMonitor("error", { message });
  process.exitCode = 1;
}

function parseArgs(items) {
  const parsed = {};
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (!item.startsWith("--")) {
      continue;
    }
    const key = item.slice(2);
    const next = items[i + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = "true";
      continue;
    }
    parsed[key] = next;
    i += 1;
  }
  return parsed;
}

function parseBoolean(value) {
  return ["1", "true", "yes", "si", "sí", "on"].includes(String(value).trim().toLowerCase());
}

function isPresent(name) {
  return Boolean(process.env[name]?.trim());
}

function secretPresence(names) {
  return Object.fromEntries(names.map((name) => [name, isPresent(name)]));
}

function severityRank(severity) {
  return { blocker: 5, high: 4, medium: 3, low: 2, info: 1 }[severity] ?? 0;
}

function normalizeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function daysSince(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return null;
  return Math.floor((Date.now() - date.getTime()) / 86_400_000);
}

function projectByVercelId(config) {
  const map = new Map();
  for (const project of config.projects ?? []) {
    for (const id of project.vercelProjectIds ?? []) {
      map.set(id, project);
    }
  }
  return map;
}

function projectByRepo(config) {
  const map = new Map();
  for (const project of config.projects ?? []) {
    if (project.repoFullName) {
      map.set(project.repoFullName.toLowerCase(), project);
    }
  }
  return map;
}

function makeFinding(input) {
  return {
    id: input.id,
    source: input.source,
    projectId: input.projectId ?? "onia-hermes",
    severity: input.severity ?? "info",
    cleanupLevel: input.cleanupLevel ?? "pull_request",
    approvalRequired: input.approvalRequired ?? input.cleanupLevel !== "safe_auto",
    title: input.title,
    detail: input.detail,
    recommendedAction: input.recommendedAction,
    evidence: input.evidence ?? [],
  };
}

async function buildReport(config) {
  const report = {
    ok: true,
    generatedAt: new Date().toISOString(),
    durationMs: 0,
    source: "github-actions-or-compatible-runner",
    mode: "audit_tasks_cleanup_plan",
    configVersion: config.version,
    checkedSources: [],
    missingSecrets: [],
    totals: {
      configuredProjects: (config.projects ?? []).length,
      vercelProjects: 0,
      githubRepos: 0,
      cleanupCandidates: 0,
      findings: 0,
    },
    envPresence: secretPresence([
      "VERCEL_TOKEN",
      "ONIA_GITHUB_AUDIT_TOKEN",
      "GITHUB_TOKEN",
      "ONIA_CENTER_BASE_URL",
      "ONIA_CENTER_INTERNAL_API_KEY",
      "OPENAI_API_KEY",
      "ANTHROPIC_API_KEY",
      "ONIA_HYGIENE_MONITOR_WEBHOOK_URL",
    ]),
    projects: [],
    findings: [],
    cleanupCandidates: [],
  };

  auditConfiguredProjects(config, report);
  await auditVercel(config, report);
  await auditGitHub(config, report);
  auditMonitoring(config, report);

  report.cleanupCandidates = report.findings.filter((finding) => finding.cleanupLevel === "approval_required" || /archive|limpiar|cleanup|eliminar/i.test(finding.title));
  report.totals.cleanupCandidates = report.cleanupCandidates.length;
  report.totals.findings = report.findings.length;
  report.findings.sort((a, b) => severityRank(b.severity) - severityRank(a.severity) || a.source.localeCompare(b.source));
  report.durationMs = Date.now() - startedAt.getTime();
  return report;
}

function auditConfiguredProjects(config, report) {
  report.checkedSources.push("configured_projects");

  for (const project of config.projects ?? []) {
    const isRemoteLinked = Boolean(project.repoFullName || project.vercelProjectIds?.length);
    report.projects.push({
      id: project.id,
      name: project.name,
      status: project.status,
      criticality: project.criticality,
      type: project.type,
      cleanupPolicy: project.cleanupPolicy,
      repoFullName: project.repoFullName ?? null,
      vercelProjectIds: project.vercelProjectIds ?? [],
      localPathKnown: Boolean(project.localPath),
      remoteLinked: isRemoteLinked,
    });

    if (!isRemoteLinked && ["active", "review"].includes(project.status)) {
      report.findings.push(
        makeFinding({
          id: `project-${project.id}-remote-source-missing`,
          source: "configured_projects",
          projectId: project.id,
          severity: project.status === "active" ? "high" : "medium",
          cleanupLevel: "blocked",
          approvalRequired: false,
          title: `Proyecto sin fuente remota auditable: ${project.name}`,
          detail:
            "La automatizacion no-local no puede auditar ni limpiar un proyecto que solo existe como carpeta local. Hay que conectarlo a GitHub, Vercel, VPS o un runner remoto.",
          recommendedAction: "Definir repo remoto, API o runner VPS para que entre al ciclo diario sin depender de la computadora de Sergio.",
          evidence: project.localPath ? [`localPath=${project.localPath}`] : [],
        }),
      );
    }

    if (project.status === "archive_candidate") {
      report.findings.push(
        makeFinding({
          id: `project-${project.id}-archive-review`,
          source: "configured_projects",
          projectId: project.id,
          severity: "medium",
          cleanupLevel: "approval_required",
          title: `Revisar para archivar/eliminar: ${project.name}`,
          detail: "El proyecto esta marcado como candidato a archivo. No se elimina automaticamente porque puede tener dominios, demos, clientes o historial util.",
          recommendedAction: "Confirmar si se conserva como caso/demo, se archiva o se elimina de Vercel/GitHub con respaldo.",
          evidence: project.vercelProjectIds?.map((id) => `vercelProjectId=${id}`) ?? [],
        }),
      );
    }
  }
}

async function auditVercel(config, report) {
  report.checkedSources.push("vercel");

  const token = process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID || config.sources?.vercel?.teamId;
  if (!token || !teamId) {
    if (!token) report.missingSecrets.push("VERCEL_TOKEN");
    if (!teamId) report.missingSecrets.push("VERCEL_TEAM_ID");
    report.findings.push(
      makeFinding({
        id: "vercel-token-missing",
        source: "vercel",
        severity: "high",
        cleanupLevel: "blocked",
        approvalRequired: false,
        title: "Vercel no se puede auditar desde el runner",
        detail: "El conector de Codex puede listar Vercel en esta sesion, pero el job diario necesita VERCEL_TOKEN como secret para operar cuando la computadora este apagada.",
        recommendedAction: "Crear GitHub secret VERCEL_TOKEN y opcional VERCEL_TEAM_ID. No guardar el token en el repo.",
      }),
    );
    return;
  }

  try {
    const projectsPayload = await vercelFetch(`/v10/projects?teamId=${encodeURIComponent(teamId)}&limit=100`, token);
    const projects = projectsPayload.projects ?? [];
    report.totals.vercelProjects = projects.length;
    const knownById = projectByVercelId(config);

    for (const project of projects) {
      const known = knownById.get(project.id);
      if (!known) {
        report.findings.push(
          makeFinding({
            id: `vercel-unregistered-${project.id}`,
            source: "vercel",
            projectId: "onia-hermes",
            severity: likelyDisposableName(project.name) ? "medium" : "low",
            cleanupLevel: "approval_required",
            title: `Proyecto Vercel no registrado: ${project.name}`,
            detail: "Existe en Vercel pero no esta en el inventario de higiene. Puede ser demo, cliente viejo o recurso huerfano.",
            recommendedAction: "Clasificar propietario, dominio, repo y valor comercial antes de conservar o eliminar.",
            evidence: [`vercelProjectId=${project.id}`],
          }),
        );
      }

      await auditVercelDeployments(project, known, teamId, token, report);
    }
  } catch (error) {
    report.findings.push(
      makeFinding({
        id: "vercel-api-error",
        source: "vercel",
        severity: "high",
        cleanupLevel: "blocked",
        approvalRequired: false,
        title: "Error consultando Vercel API",
        detail: error instanceof Error ? error.message : String(error),
        recommendedAction: "Revisar token, teamId y permisos del secret VERCEL_TOKEN.",
      }),
    );
  }
}

async function auditVercelDeployments(project, known, teamId, token, report) {
  try {
    const payload = await vercelFetch(`/v6/deployments?teamId=${encodeURIComponent(teamId)}&projectId=${encodeURIComponent(project.id)}&limit=5`, token);
    const deployments = payload.deployments ?? [];
    const latest = deployments[0];

    if (!latest) {
      report.findings.push(
        makeFinding({
          id: `vercel-${project.id}-no-deployments`,
          source: "vercel",
          projectId: known?.id ?? "onia-hermes",
          severity: known?.criticality === "critical" ? "high" : "medium",
          cleanupLevel: "approval_required",
          title: `Vercel sin deployments recientes: ${project.name}`,
          detail: "El proyecto existe pero no devolvio deployments recientes.",
          recommendedAction: "Confirmar si esta en uso, si falta repo conectado o si debe archivarse.",
          evidence: [`vercelProjectId=${project.id}`],
        }),
      );
      return;
    }

    const latestDate = normalizeDate(latest.createdAt ?? latest.created);
    const staleDays = daysSince(latestDate);
    const latestState = latest.state || "unknown";
    const productionCritical = known?.criticality === "critical" || known?.criticality === "high";

    if (latestState !== "READY" && productionCritical) {
      report.findings.push(
        makeFinding({
          id: `vercel-${project.id}-latest-not-ready`,
          source: "vercel",
          projectId: known?.id ?? "onia-hermes",
          severity: "high",
          cleanupLevel: "pull_request",
          title: `Deployment no listo en Vercel: ${project.name}`,
          detail: `El ultimo deployment esta en estado ${latestState}.`,
          recommendedAction: "Revisar build logs, confirmar si hay rollback candidate y abrir job Codex si el fallo viene de codigo.",
          evidence: [`deployment=${latest.uid ?? latest.id ?? "unknown"}`, latest.url ? `url=${latest.url}` : "url=unknown"],
        }),
      );
    }

    if (latestState === "ERROR" && !productionCritical) {
      report.findings.push(
        makeFinding({
          id: `vercel-${project.id}-demo-error`,
          source: "vercel",
          projectId: known?.id ?? "onia-hermes",
          severity: "medium",
          cleanupLevel: "approval_required",
          title: `Demo/proyecto con deployment fallido: ${project.name}`,
          detail: "Un proyecto no critico falla en Vercel. Puede estar consumiendo atencion y conviene archivar, corregir o eliminar.",
          recommendedAction: "Clasificar si sigue vendiendo algo. Si no, aprobar archivo/eliminacion.",
          evidence: [`deployment=${latest.uid ?? latest.id ?? "unknown"}`],
        }),
      );
    }

    if (staleDays !== null && staleDays > 45 && known?.status !== "active") {
      report.findings.push(
        makeFinding({
          id: `vercel-${project.id}-stale-${staleDays}`,
          source: "vercel",
          projectId: known?.id ?? "onia-hermes",
          severity: "medium",
          cleanupLevel: "approval_required",
          title: `Proyecto Vercel viejo o sin movimiento: ${project.name}`,
          detail: `Ultimo deployment hace ${staleDays} dias y el proyecto no esta marcado como activo.`,
          recommendedAction: "Revisar dominio, cliente y repo. Archivar o eliminar despues de respaldo si no tiene valor.",
          evidence: [`latestDeploymentAt=${latestDate}`],
        }),
      );
    }
  } catch (error) {
    report.findings.push(
      makeFinding({
        id: `vercel-${project.id}-deployment-audit-error`,
        source: "vercel",
        projectId: known?.id ?? "onia-hermes",
        severity: "medium",
        cleanupLevel: "blocked",
        approvalRequired: false,
        title: `No se pudieron leer deployments de ${project.name}`,
        detail: error instanceof Error ? error.message : String(error),
        recommendedAction: "Revisar permisos del token Vercel para deployments.",
      }),
    );
  }
}

async function vercelFetch(pathname, token) {
  const response = await fetch(`https://api.vercel.com${pathname}`, {
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Vercel ${response.status}: ${body.slice(0, 300)}`);
  }

  return response.json();
}

function likelyDisposableName(name = "") {
  return /demo|test|temp|zen|old|copy|nude/i.test(name);
}

async function auditGitHub(config, report) {
  report.checkedSources.push("github");

  const token = process.env.ONIA_GITHUB_AUDIT_TOKEN || process.env.GITHUB_TOKEN;
  const repos = (config.projects ?? []).filter((project) => project.repoFullName);
  if (!token) {
    report.missingSecrets.push("ONIA_GITHUB_AUDIT_TOKEN");
    report.findings.push(
      makeFinding({
        id: "github-token-missing",
        source: "github",
        severity: "high",
        cleanupLevel: "blocked",
        approvalRequired: false,
        title: "GitHub no puede auditar todos los repos",
        detail: "El job diario necesita un token con acceso read-only a los repos de ONIA para revisar actividad, workflows y fallos sin depender de la PC.",
        recommendedAction: "Crear ONIA_GITHUB_AUDIT_TOKEN como GitHub secret. Para repos privados ajenos al repo actual no basta el GITHUB_TOKEN automatico.",
      }),
    );
    return;
  }

  const knownRepos = projectByRepo(config);
  for (const project of repos) {
    const repoFullName = project.repoFullName;
    try {
      const repo = await githubFetch(`/repos/${repoFullName}`, token);
      report.totals.githubRepos += 1;
      const pushedDays = daysSince(repo.pushed_at);
      const updatedDays = daysSince(repo.updated_at);

      if (repo.archived && project.status === "active") {
        report.findings.push(
          makeFinding({
            id: `github-${slug(repoFullName)}-archived-active`,
            source: "github",
            projectId: project.id,
            severity: "high",
            cleanupLevel: "blocked",
            approvalRequired: false,
            title: `Repo activo aparece archivado: ${repoFullName}`,
            detail: "El inventario lo considera activo, pero GitHub lo reporta archivado.",
            recommendedAction: "Corregir inventario o restaurar repo antes de prometer mantenimiento.",
          }),
        );
      }

      if (pushedDays !== null && pushedDays > 30 && project.status === "active") {
        report.findings.push(
          makeFinding({
            id: `github-${slug(repoFullName)}-stale-active`,
            source: "github",
            projectId: project.id,
            severity: project.criticality === "critical" ? "medium" : "low",
            cleanupLevel: "pull_request",
            title: `Repo activo sin push reciente: ${repoFullName}`,
            detail: `Ultimo push hace ${pushedDays} dias. No es necesariamente malo, pero conviene confirmar que builds, dependencias y backlog estan sanos.`,
            recommendedAction: "Revisar ultima CI, dependencias y tareas abiertas. Si todo esta estable, marcar como estable en el siguiente reporte.",
            evidence: [`pushed_at=${repo.pushed_at}`, `updated_at=${repo.updated_at}`, `updatedDays=${updatedDays}`],
          }),
        );
      }

      await auditGitHubActions(repoFullName, knownRepos.get(repoFullName.toLowerCase()) ?? project, token, report);
    } catch (error) {
      report.findings.push(
        makeFinding({
          id: `github-${slug(repoFullName)}-api-error`,
          source: "github",
          projectId: project.id,
          severity: project.status === "active" ? "high" : "medium",
          cleanupLevel: "blocked",
          approvalRequired: false,
          title: `No se pudo auditar GitHub repo: ${repoFullName}`,
          detail: error instanceof Error ? error.message : String(error),
          recommendedAction: "Revisar si el repo existe, si cambio de owner/nombre o si el token tiene permisos.",
        }),
      );
    }
  }
}

async function auditGitHubActions(repoFullName, project, token, report) {
  try {
    const runs = await githubFetch(`/repos/${repoFullName}/actions/runs?per_page=5`, token);
    const latest = runs.workflow_runs?.[0];
    if (!latest) {
      report.findings.push(
        makeFinding({
          id: `github-${slug(repoFullName)}-no-actions`,
          source: "github",
          projectId: project.id,
          severity: project.criticality === "critical" ? "medium" : "low",
          cleanupLevel: "pull_request",
          title: `Repo sin runs recientes de GitHub Actions: ${repoFullName}`,
          detail: "No hay evidencia remota de build/test reciente.",
          recommendedAction: "Agregar workflow de CI o conectar una revision remota para que el mantenimiento diario sea verificable.",
        }),
      );
      return;
    }

    if (latest.status === "completed" && latest.conclusion && latest.conclusion !== "success") {
      report.findings.push(
        makeFinding({
          id: `github-${slug(repoFullName)}-latest-action-${latest.conclusion}`,
          source: "github",
          projectId: project.id,
          severity: project.criticality === "critical" ? "high" : "medium",
          cleanupLevel: "pull_request",
          title: `Ultima Action fallida en ${repoFullName}`,
          detail: `Workflow ${latest.name} termino con conclusion ${latest.conclusion}.`,
          recommendedAction: "Crear job Codex para leer logs y reparar CI/build si sigue fallando.",
          evidence: [`runUrl=${latest.html_url}`],
        }),
      );
    }
  } catch (error) {
    report.findings.push(
      makeFinding({
        id: `github-${slug(repoFullName)}-actions-error`,
        source: "github",
        projectId: project.id,
        severity: "medium",
        cleanupLevel: "blocked",
        approvalRequired: false,
        title: `No se pudieron leer Actions de ${repoFullName}`,
        detail: error instanceof Error ? error.message : String(error),
        recommendedAction: "Revisar permisos Actions read del token GitHub.",
      }),
    );
  }
}

async function githubFetch(pathname, token) {
  const response = await fetch(`https://api.github.com${pathname}`, {
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
      "user-agent": "onia-project-hygiene",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub ${response.status}: ${body.slice(0, 300)}`);
  }

  return response.json();
}

function auditMonitoring(config, report) {
  report.checkedSources.push("monitoring");
  const monitorEnv = config.sources?.sentry?.webhookUrlEnv || "ONIA_HYGIENE_MONITOR_WEBHOOK_URL";
  if (!process.env[monitorEnv]) {
    report.findings.push(
      makeFinding({
        id: "monitoring-webhook-missing",
        source: "monitoring",
        severity: "medium",
        cleanupLevel: "blocked",
        approvalRequired: false,
        title: "Falta monitor externo para la automatizacion diaria",
        detail:
          "La automatizacion puede correr en GitHub Actions, pero ONIA necesita un monitor externo tipo Sentry Cron, Healthchecks o Better Stack para detectar si no corrio.",
        recommendedAction: `Configurar ${monitorEnv} con un monitor de cron externo. Sentry sirve para alertar fallos/missed runs, no para ejecutar limpieza.`,
      }),
    );
  } else {
    monitorOk = true;
  }
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function postToOniaCenter(config, report) {
  const baseUrl = process.env.ONIA_CENTER_BASE_URL?.replace(/\/$/, "");
  const internalKey = process.env.ONIA_CENTER_INTERNAL_API_KEY;
  const endpoint = config.sources?.oniaCenter?.dailyEndpoint || "/api/onia-center/hygiene/daily";

  if (!baseUrl || !internalKey) {
    return {
      requested: true,
      attempted: false,
      ok: false,
      mode: "missing_configuration",
      message: "Missing ONIA_CENTER_BASE_URL or ONIA_CENTER_INTERNAL_API_KEY.",
    };
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${internalKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ commit: true, report }),
  });

  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text.slice(0, 500) };
  }

  return {
    requested: true,
    attempted: true,
    ok: response.ok && payload.ok !== false,
    mode: payload.mode || `http_${response.status}`,
    message: payload.message || text.slice(0, 500),
    result: payload.result ?? null,
  };
}

async function writeOutputs(report) {
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "onia-project-hygiene-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await writeFile(path.join(outDir, "onia-project-hygiene-summary.md"), renderMarkdown(report), "utf8");
}

function renderMarkdown(report) {
  const lines = [
    "# ONIA Project Hygiene Report",
    "",
    `- Generated at: ${report.generatedAt}`,
    `- Duration: ${report.durationMs} ms`,
    `- Configured projects: ${report.totals.configuredProjects}`,
    `- Vercel projects checked: ${report.totals.vercelProjects}`,
    `- GitHub repos checked: ${report.totals.githubRepos}`,
    `- Findings: ${report.totals.findings}`,
    `- Cleanup candidates: ${report.totals.cleanupCandidates}`,
    `- ONIA Center commit: ${report.oniaCenterCommit?.mode ?? "not_attempted"}`,
    "",
    "## Top Findings",
    "",
  ];

  const top = report.findings.slice(0, 20);
  if (!top.length) {
    lines.push("No findings.");
  } else {
    for (const finding of top) {
      lines.push(`### [${finding.severity}] ${finding.title}`);
      lines.push("");
      lines.push(`- Source: ${finding.source}`);
      lines.push(`- Project: ${finding.projectId}`);
      lines.push(`- Cleanup level: ${finding.cleanupLevel}`);
      lines.push(`- Approval required: ${finding.approvalRequired ? "yes" : "no"}`);
      lines.push(`- Detail: ${finding.detail}`);
      lines.push(`- Recommended action: ${finding.recommendedAction}`);
      if (finding.evidence?.length) {
        lines.push(`- Evidence: ${finding.evidence.join("; ")}`);
      }
      lines.push("");
    }
  }

  return `${lines.join("\n")}\n`;
}

async function notifyMonitor(status, payload) {
  const url = process.env.ONIA_HYGIENE_MONITOR_WEBHOOK_URL;
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        status,
        name: "onia-project-hygiene",
        generatedAt: new Date().toISOString(),
        ...payload,
      }),
    });
    monitorOk = true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Monitor webhook failed: ${message}`);
  }
}

process.on("beforeExit", () => {
  if (!monitorOk && process.env.ONIA_HYGIENE_MONITOR_WEBHOOK_URL) {
    console.warn("Monitor webhook was configured but no successful notification was confirmed.");
  }
});
