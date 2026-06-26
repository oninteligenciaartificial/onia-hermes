import { NextResponse } from "next/server";
import { operationalServices, vendorCommissionRules } from "@/app/onia-center/source";
import type { RoleId } from "@/app/onia-center/types";
import {
  filterOniaCenterRuntimeForRole,
  getMissingOniaCenterConfig,
  getOniaCenterRuntime,
  isOniaCenterConfigured,
} from "@/lib/onia-center-store";
import { getOniaCenterActor, type OniaCenterAuthResult } from "@/lib/onia-center-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AssistantRequest = {
  question?: string;
};

type DifyConfig = {
  enabled: boolean;
  baseUrl: string;
  apiKey: string;
};

type DifyChatResponse = {
  answer?: string;
  conversation_id?: string;
  message_id?: string;
};

function authFailureResponse(auth: Extract<OniaCenterAuthResult, { ok: false }>) {
  return NextResponse.json(
    {
      ok: false,
      mode: auth.code,
      message: auth.message,
      missingConfiguration: auth.missingConfiguration ?? [],
      answer: null,
    },
    { status: auth.status },
  );
}

function getDifyConfig(): DifyConfig {
  const provider = (process.env.ONIA_ASSISTANT_PROVIDER || "local").trim().toLowerCase();
  const baseUrl = (process.env.DIFY_BASE_URL || process.env.DIFY_API_BASE_URL || "").replace(/\/$/, "");
  const apiKey = process.env.DIFY_ONIA_CENTER_API_KEY || process.env.DIFY_API_KEY || "";

  return {
    enabled: provider === "dify" && Boolean(baseUrl && apiKey),
    baseUrl,
    apiKey,
  };
}

function difyChatMessagesUrl(baseUrl: string) {
  const normalized = baseUrl.endsWith("/v1") ? baseUrl : `${baseUrl}/v1`;
  return `${normalized}/chat-messages`;
}

function publicServiceContext(role: RoleId) {
  return {
    priorityServices: operationalServices.map((service) => ({
      id: service.id,
      name: service.name,
      plan: service.plan,
      setupPriceBs: service.setupPriceBs ?? null,
      monthlyPriceBs: service.monthlyPriceBs ?? null,
      isRecurring: service.isRecurring,
      salesScript: service.salesScript ?? null,
      quoteTemplate: service.quoteTemplate ?? null,
      includes: (service.includes ?? service.deliverables ?? []).slice(0, 8),
      notIncluded: (service.notIncluded ?? []).slice(0, 8),
      evidenceRequired: (service.evidenceRequired ?? []).slice(0, 8),
      sellerCommission: service.sellerCommission ?? null,
      risk: service.risk ?? null,
    })),
    sellerCatalog: vendorCommissionRules
      .filter((rule) => rule.visibility.includes(role))
      .map((rule) => ({
        id: rule.id,
        category: rule.category,
        serviceName: rule.serviceName,
        clientPriceLabel: rule.clientPriceLabel,
        commissionLabel: rule.commissionLabel,
        offerWhen: rule.offerWhen,
        firstPaymentOnly: rule.firstPaymentOnly,
        requiresSergioApproval: Boolean(rule.requiresSergioApproval),
        conditions: rule.conditions.slice(0, 6),
      })),
  };
}

async function callDify({
  config,
  question,
  role,
  actorKey,
  safeContext,
}: {
  config: DifyConfig;
  question: string;
  role: RoleId;
  actorKey: string;
  safeContext: unknown;
}) {
  const response = await fetch(difyChatMessagesUrl(config.baseUrl), {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      inputs: {
        onia_role: role,
        onia_policy:
          "Responde en espanol, usa solo el contexto permitido, no inventes datos y no reveles capital, deuda, caja real, utilidad privada, credenciales ni estrategia sensible.",
        onia_context_json: JSON.stringify(safeContext),
      },
      query: [
        "Actua como asistente interno de ONIA Center.",
        "Usa solo el contexto permitido que recibiste en onia_context_json.",
        "Si falta informacion, di que no esta visible o no esta registrado.",
        "No apruebes pagos, descuentos, gastos, comisiones ni contacto sensible.",
        "",
        `Pregunta: ${question}`,
      ].join("\n"),
      response_mode: "blocking",
      user: `onia-center-${actorKey}`,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Dify ${response.status}: ${body.slice(0, 500)}`);
  }

  return (await response.json()) as DifyChatResponse;
}

export async function POST(request: Request) {
  if (!isOniaCenterConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        mode: "configuration_pending",
        message: "ONIA Center necesita Supabase server-side antes de enviar contexto a Dify.",
        missingConfiguration: getMissingOniaCenterConfig(),
        answer: null,
      },
      { status: 200 },
    );
  }

  const auth = await getOniaCenterActor(request);
  if (!auth.ok) {
    return authFailureResponse(auth);
  }

  let payload: AssistantRequest;
  try {
    payload = (await request.json()) as AssistantRequest;
  } catch {
    return NextResponse.json({ ok: false, mode: "bad_request", message: "El cuerpo debe ser JSON valido.", answer: null }, { status: 400 });
  }

  const question = (payload.question ?? "").trim();
  if (!question) {
    return NextResponse.json({ ok: false, mode: "bad_request", message: "question es requerido.", answer: null }, { status: 400 });
  }

  const dify = getDifyConfig();
  if (!dify.enabled) {
    return NextResponse.json(
      {
        ok: false,
        mode: "dify_not_configured",
        message: "Dify no esta activo. Define ONIA_ASSISTANT_PROVIDER=dify, DIFY_BASE_URL y DIFY_ONIA_CENTER_API_KEY o DIFY_API_KEY.",
        missingConfiguration: ["ONIA_ASSISTANT_PROVIDER=dify", "DIFY_BASE_URL", "DIFY_ONIA_CENTER_API_KEY"],
        answer: null,
      },
      { status: 200 },
    );
  }

  try {
    const runtimeSnapshot = filterOniaCenterRuntimeForRole(await getOniaCenterRuntime(), auth.actor.role);
    const safeContext = {
      actor: {
        userKey: auth.actor.userKey,
        displayName: auth.actor.displayName,
        role: auth.actor.role,
      },
      services: publicServiceContext(auth.actor.role),
      runtime: {
        leads: runtimeSnapshot.leads.slice(0, 40),
        tasks: runtimeSnapshot.tasks.slice(0, 60),
        reviews: runtimeSnapshot.reviews.slice(0, 20),
        notes: runtimeSnapshot.notes.slice(0, 60),
        ideas: runtimeSnapshot.ideas.slice(0, 40),
      },
      guardrails: [
        "Arthur y vendedores no ven capital Sergio, deuda exacta, caja real completa, compras futuras ni utilidad personal.",
        "Ninguna comision se aprueba sin evidencia y Sergio.",
        "Ningun servicio nuevo se vende si no tiene precio, centro, costos excluidos, evidencia, responsable y checklist.",
      ],
    };
    const difyResponse = await callDify({
      config: dify,
      question,
      role: auth.actor.role,
      actorKey: auth.actor.userKey,
      safeContext,
    });

    return NextResponse.json({
      ok: true,
      mode: "dify",
      answer: difyResponse.answer ?? "Dify respondio sin campo answer.",
      conversationId: difyResponse.conversation_id ?? null,
      messageId: difyResponse.message_id ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error consultando Dify.";
    return NextResponse.json({ ok: false, mode: "dify_error", message, answer: null }, { status: 502 });
  }
}
