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

type AssistantProvider = "local" | "dify" | "openai";

type DifyConfig = {
  enabled: boolean;
  baseUrl: string;
  apiKey: string;
};

type OpenAIConfig = {
  enabled: boolean;
  baseUrl: string;
  apiKey: string;
  model: string;
  maxOutputTokens: number;
};

type DifyChatResponse = {
  answer?: string;
  conversation_id?: string;
  message_id?: string;
};

type OpenAIResponse = {
  id?: string;
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
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

function getAssistantProvider(): AssistantProvider {
  const provider = (process.env.ONIA_ASSISTANT_PROVIDER || "local").trim().toLowerCase();

  if (provider === "dify" || provider === "openai") {
    return provider;
  }

  return "local";
}

function getDifyConfig(provider = getAssistantProvider()): DifyConfig {
  const baseUrl = (process.env.DIFY_BASE_URL || process.env.DIFY_API_BASE_URL || "").replace(/\/$/, "");
  const apiKey = process.env.DIFY_ONIA_CENTER_API_KEY || process.env.DIFY_API_KEY || "";

  return {
    enabled: provider === "dify" && Boolean(baseUrl && apiKey),
    baseUrl,
    apiKey,
  };
}

function parsePositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getOpenAIConfig(provider = getAssistantProvider()): OpenAIConfig {
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const apiKey = process.env.OPENAI_ONIA_CENTER_API_KEY || process.env.OPENAI_API_KEY || "";
  const model = process.env.OPENAI_ONIA_CENTER_MODEL || process.env.OPENAI_MODEL || "gpt-5.4-mini";

  return {
    enabled: provider === "openai" && Boolean(apiKey),
    baseUrl,
    apiKey,
    model,
    maxOutputTokens: parsePositiveInt(process.env.ONIA_ASSISTANT_MAX_OUTPUT_TOKENS, 900),
  };
}

function difyChatMessagesUrl(baseUrl: string) {
  const normalized = baseUrl.endsWith("/v1") ? baseUrl : `${baseUrl}/v1`;
  return `${normalized}/chat-messages`;
}

function openAIResponsesUrl(baseUrl: string) {
  const normalized = baseUrl.endsWith("/v1") ? baseUrl : `${baseUrl}/v1`;
  return `${normalized}/responses`;
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

function assistantInstructions(role: RoleId) {
  return [
    "Eres ONIA Bot interno dentro de ONIA Center.",
    "Responde en espanol, directo y accionable.",
    "Usa solo el contexto permitido que recibes. Si falta informacion, di que no esta visible o no esta registrado.",
    "No inventes estados de clientes, precios, pagos, comisiones ni decisiones.",
    "No apruebes pagos, descuentos, gastos, comisiones, herramientas premium ni contacto sensible.",
    "No reveles capital, deuda, caja real completa, utilidad privada, credenciales, estrategia familiar ni acuerdos sensibles.",
    `Rol autenticado del usuario: ${role}. Respeta estrictamente los permisos de ese rol.`,
  ].join("\n");
}

function assistantInput(question: string, safeContext: unknown) {
  return [
    "Contexto filtrado por rol:",
    JSON.stringify(safeContext),
    "",
    "Pregunta del usuario:",
    question,
  ].join("\n");
}

async function getSafeAssistantContext(auth: Extract<OniaCenterAuthResult, { ok: true }>) {
  const runtimeSnapshot = filterOniaCenterRuntimeForRole(await getOniaCenterRuntime(), auth.actor.role);

  return {
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
        onia_policy: assistantInstructions(role),
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

function extractOpenAIText(payload: OpenAIResponse) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }

  const textParts =
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .filter((text): text is string => Boolean(text?.trim())) ?? [];

  return textParts.join("\n").trim();
}

async function callOpenAI({
  config,
  question,
  role,
  safeContext,
}: {
  config: OpenAIConfig;
  question: string;
  role: RoleId;
  safeContext: unknown;
}) {
  const response = await fetch(openAIResponsesUrl(config.baseUrl), {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      instructions: assistantInstructions(role),
      input: assistantInput(question, safeContext),
      max_output_tokens: config.maxOutputTokens,
      store: false,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI ${response.status}: ${body.slice(0, 500)}`);
  }

  const payload = (await response.json()) as OpenAIResponse;
  return {
    id: payload.id ?? null,
    answer: extractOpenAIText(payload) || "OpenAI respondio sin texto final.",
  };
}

export async function POST(request: Request) {
  if (!isOniaCenterConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        mode: "configuration_pending",
        message: "ONIA Center necesita Supabase server-side antes de enviar contexto al proveedor de IA.",
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

  const provider = getAssistantProvider();
  const dify = getDifyConfig(provider);
  const openai = getOpenAIConfig(provider);

  if (provider === "dify" && !dify.enabled) {
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

  if (provider === "openai" && !openai.enabled) {
    return NextResponse.json(
      {
        ok: false,
        mode: "openai_not_configured",
        message: "OpenAI no esta activo. Define ONIA_ASSISTANT_PROVIDER=openai y OPENAI_ONIA_CENTER_API_KEY u OPENAI_API_KEY.",
        missingConfiguration: ["ONIA_ASSISTANT_PROVIDER=openai", "OPENAI_ONIA_CENTER_API_KEY"],
        answer: null,
      },
      { status: 200 },
    );
  }

  if (provider === "local") {
    return NextResponse.json(
      {
        ok: false,
        mode: "assistant_not_configured",
        message: "Proveedor IA no configurado. Usa ONIA_ASSISTANT_PROVIDER=openai ahora o dify cuando este desplegado.",
        missingConfiguration: ["ONIA_ASSISTANT_PROVIDER=openai", "OPENAI_ONIA_CENTER_API_KEY"],
        answer: null,
      },
      { status: 200 },
    );
  }

  try {
    const safeContext = await getSafeAssistantContext(auth);

    if (provider === "openai") {
      const openaiResponse = await callOpenAI({
        config: openai,
        question,
        role: auth.actor.role,
        safeContext,
      });

      return NextResponse.json({
        ok: true,
        mode: "openai",
        answer: openaiResponse.answer,
        responseId: openaiResponse.id,
        model: openai.model,
      });
    }

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
    return NextResponse.json({ ok: false, mode: `${provider}_error`, message, answer: null }, { status: 502 });
  }
}
