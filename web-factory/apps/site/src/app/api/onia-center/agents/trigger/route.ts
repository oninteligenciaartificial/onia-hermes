import { NextResponse } from "next/server";
import { getMissingOniaCenterConfig, isOniaCenterConfigured } from "@/lib/onia-center-store";
import { getOniaCenterActor, isSergio, type OniaCenterAuthResult } from "@/lib/onia-center-auth";
import { getVisibleOperatingAgents } from "@/app/onia-center/operating-engine";
import { recordAgentTrigger, resolveAgentWebhookUrl } from "@/app/onia-center/live/live-runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Dispara el webhook n8n de un agente desde el panel. Solo Sergio.
// La URL del webhook NUNCA viene del request: se resuelve server-side desde
// env / integration_connectors (controlado por infra). El usuario solo elige
// QUE agente disparar. Si no hay webhook configurado, responde claro sin romper.

function configurationPendingResponse() {
  return NextResponse.json(
    {
      ok: false,
      mode: "configuration_pending",
      message: "Onia Center aun no tiene Supabase server-side configurado.",
      missingConfiguration: getMissingOniaCenterConfig(),
      data: null,
    },
    { status: 200 },
  );
}

function authFailureResponse(auth: Extract<OniaCenterAuthResult, { ok: false }>) {
  return NextResponse.json(
    {
      ok: false,
      mode: auth.code,
      message: auth.message,
      missingConfiguration: auth.missingConfiguration ?? [],
      data: null,
    },
    { status: auth.status },
  );
}

async function dispatchWebhook(
  url: string,
  body: Record<string, unknown>,
): Promise<{ status: "sent" | "failed"; httpStatus: number | null; detail: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  // El secreto compartido. Este endpoint del panel YA exige sesion, pero el webhook de n8n del
  // otro lado no valida nada: quien conozca la URL dispara agentes salteandose el panel entero.
  // Todos los demas webhooks de ONIA (nuevo-lead, generar-propuesta) ya viajan con `secret` y lo
  // validan server-side contra ONIA_CENTER_INTERNAL_API_KEY; este quedo afuera. Se manda por
  // header Y por body: el header es lo correcto, el body mantiene la forma que ya usan los otros
  // nodos de n8n para que la validacion sea la misma en todos.
  const secret = process.env.ONIA_CENTER_INTERNAL_API_KEY ?? "";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(secret ? { "x-onia-webhook-secret": secret } : {}),
      },
      body: JSON.stringify(secret ? { ...body, secret } : body),
      cache: "no-store",
      signal: controller.signal,
    });
    return response.ok
      ? { status: "sent", httpStatus: response.status, detail: `Webhook respondio ${response.status}.` }
      : { status: "failed", httpStatus: response.status, detail: `Webhook respondio ${response.status}.` };
  } catch (error) {
    const message = error instanceof Error ? error.message : "error de red";
    return { status: "failed", httpStatus: null, detail: `No se pudo contactar el webhook: ${message}.` };
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  if (!isOniaCenterConfigured()) {
    return configurationPendingResponse();
  }

  const auth = await getOniaCenterActor(request);
  if (!auth.ok) {
    return authFailureResponse(auth);
  }

  if (!isSergio(auth.actor)) {
    return NextResponse.json(
      { ok: false, mode: "forbidden", message: "Solo Sergio puede disparar agentes." },
      { status: 403 },
    );
  }

  let payload: { agentId?: string };
  try {
    payload = (await request.json()) as { agentId?: string };
  } catch {
    return NextResponse.json({ ok: false, mode: "bad_request", message: "El cuerpo debe ser JSON valido." }, { status: 400 });
  }

  const agentId = typeof payload.agentId === "string" ? payload.agentId.trim() : "";
  if (!agentId) {
    return NextResponse.json({ ok: false, mode: "bad_request", message: "agentId es requerido." }, { status: 400 });
  }

  // El agente debe existir en el roster visible para el actor (Sergio ve todos).
  const agent = getVisibleOperatingAgents(auth.actor.role).find((item) => item.id === agentId);
  if (!agent) {
    return NextResponse.json({ ok: false, mode: "agent_not_found", message: "Agente desconocido." }, { status: 404 });
  }

  const webhookUrl = await resolveAgentWebhookUrl(agentId);
  if (!webhookUrl) {
    // No es un error del usuario: el agente simplemente no tiene webhook cableado.
    return NextResponse.json(
      {
        ok: false,
        mode: "webhook_not_configured",
        message: `${agent.name} todavia no tiene webhook n8n configurado. Infra debe cablearlo.`,
        data: { agentId, agentName: agent.name },
      },
      { status: 200 },
    );
  }

  const at = new Date().toISOString();
  const result = await dispatchWebhook(webhookUrl, {
    source: "onia-center-panel",
    agentId,
    agentName: agent.name,
    triggeredBy: auth.actor.userKey,
    triggeredByRole: auth.actor.dbRole,
    at,
  });

  // Best-effort: registrar la corrida en audit_logs para que aparezca en el feed.
  await recordAgentTrigger({
    agentId,
    agentName: agent.name,
    actorRoleKey: auth.actor.dbRole,
    actorLabel: auth.actor.displayName,
    actorUserKey: auth.actor.userKey,
    status: result.status,
    detail: result.detail,
    httpStatus: result.httpStatus,
  });

  if (result.status === "failed") {
    return NextResponse.json(
      {
        ok: false,
        mode: "trigger_failed",
        message: `No se pudo disparar ${agent.name}. ${result.detail}`,
        data: { agentId, agentName: agent.name, httpStatus: result.httpStatus },
      },
      { status: 200 },
    );
  }

  return NextResponse.json({
    ok: true,
    mode: "agent_triggered",
    message: `${agent.name} disparado.`,
    data: { agentId, agentName: agent.name, httpStatus: result.httpStatus, at },
  });
}
