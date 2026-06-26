import { NextResponse } from "next/server";
import { operationalServices, vendorCommissionRules } from "@/app/onia-center/source";
import {
  getMissingOniaCenterConfig,
  isOniaCenterConfigured,
} from "@/lib/onia-center-store";
import { getOniaCenterActor, type OniaCenterAuthResult } from "@/lib/onia-center-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type AudioObjective = "propuesta" | "acta" | "seguimiento";

type ParsedAudioRequest = {
  audioFile: File | null;
  transcript: string;
  clientName: string;
  context: string;
  objective: AudioObjective;
};

type SttConfig = {
  baseUrl: string;
  apiKey: string;
  model: string;
  language: string;
  maxFileMb: number;
};

type OpenAIConfig = {
  baseUrl: string;
  apiKey: string;
  model: string;
  maxOutputTokens: number;
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

function parsePositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function allowLocalWithoutSupabase() {
  return process.env.NODE_ENV !== "production" || process.env.ONIA_AUDIO_INTELLIGENCE_ALLOW_LOCAL === "true";
}

function authFailureResponse(auth: Extract<OniaCenterAuthResult, { ok: false }>) {
  return NextResponse.json(
    {
      ok: false,
      mode: auth.code,
      message: auth.message,
      missingConfiguration: auth.missingConfiguration ?? [],
      transcript: null,
      analysis: null,
    },
    { status: auth.status },
  );
}

function getSttConfig(): SttConfig {
  const baseUrl = (process.env.ONIA_AUDIO_STT_BASE_URL || process.env.STT_BASE_URL || "http://127.0.0.1:3108/v1").replace(/\/$/, "");
  return {
    baseUrl,
    apiKey: process.env.ONIA_AUDIO_STT_API_KEY || process.env.STT_API_KEY || "",
    model: process.env.ONIA_AUDIO_STT_MODEL || process.env.STT_MODEL || "Systran/faster-distil-whisper-large-v3",
    language: process.env.ONIA_AUDIO_STT_LANGUAGE || "es",
    maxFileMb: parsePositiveInt(process.env.ONIA_AUDIO_MAX_MB, 50),
  };
}

function getOpenAIConfig(): OpenAIConfig {
  return {
    baseUrl: (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, ""),
    apiKey: process.env.OPENAI_ONIA_CENTER_API_KEY || process.env.OPENAI_API_KEY || "",
    model: process.env.ONIA_AUDIO_ANALYSIS_MODEL || process.env.OPENAI_ONIA_CENTER_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini",
    maxOutputTokens: parsePositiveInt(process.env.ONIA_AUDIO_MAX_OUTPUT_TOKENS, 1800),
  };
}

function openAIResponsesUrl(baseUrl: string) {
  const normalized = baseUrl.endsWith("/v1") ? baseUrl : `${baseUrl}/v1`;
  return `${normalized}/responses`;
}

function sttTranscriptionUrl(baseUrl: string) {
  const normalized = baseUrl.endsWith("/v1") ? baseUrl : `${baseUrl}/v1`;
  return `${normalized}/audio/transcriptions`;
}

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeObjective(value: string): AudioObjective {
  if (value === "acta" || value === "seguimiento") {
    return value;
  }

  return "propuesta";
}

async function parseRequest(request: Request): Promise<ParsedAudioRequest> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const fileEntry = formData.get("audio") ?? formData.get("file");
    const audioFile =
      fileEntry && typeof fileEntry === "object" && "arrayBuffer" in fileEntry && "size" in fileEntry
        ? (fileEntry as File)
        : null;

    return {
      audioFile: audioFile && audioFile.size > 0 ? audioFile : null,
      transcript: formString(formData, "transcript"),
      clientName: formString(formData, "clientName") || formString(formData, "cliente"),
      context: formString(formData, "context"),
      objective: normalizeObjective(formString(formData, "objective") || formString(formData, "objetivo")),
    };
  }

  const payload = (await request.json()) as Partial<Record<string, string>>;
  return {
    audioFile: null,
    transcript: (payload.transcript ?? payload.texto ?? "").trim(),
    clientName: (payload.clientName ?? payload.cliente ?? "").trim(),
    context: (payload.context ?? payload.contexto ?? "").trim(),
    objective: normalizeObjective((payload.objective ?? payload.objetivo ?? "").trim()),
  };
}

async function transcribeAudio(file: File, config: SttConfig) {
  if (file.size > config.maxFileMb * 1024 * 1024) {
    throw new Error(`El audio supera ${config.maxFileMb} MB. Procesalo con el script del VPS o divide la reunion.`);
  }

  const formData = new FormData();
  formData.append("file", file, file.name || "audio-cliente.webm");
  formData.append("model", config.model);
  formData.append("language", config.language);
  formData.append("response_format", "json");

  const headers: HeadersInit = {};
  if (config.apiKey) {
    headers.authorization = `Bearer ${config.apiKey}`;
  }

  const response = await fetch(sttTranscriptionUrl(config.baseUrl), {
    method: "POST",
    headers,
    body: formData,
    cache: "no-store",
  });

  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error(`STT ${response.status}: ${bodyText.slice(0, 500)}`);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    return bodyText.trim();
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const text = record.text ?? record.transcript ?? record.transcription;
    if (typeof text === "string" && text.trim()) {
      return text.trim();
    }
  }

  throw new Error("El motor STT respondio sin transcript.");
}

function extractOpenAIText(payload: OpenAIResponse) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const textParts =
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .filter((text): text is string => Boolean(text?.trim())) ?? [];

  return textParts.join("\n").trim();
}

function extractJsonObject(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() ?? text.trim();

  try {
    return JSON.parse(candidate) as Record<string, unknown>;
  } catch {
    const first = candidate.indexOf("{");
    const last = candidate.lastIndexOf("}");
    if (first >= 0 && last > first) {
      return JSON.parse(candidate.slice(first, last + 1)) as Record<string, unknown>;
    }
    throw new Error("El modelo no devolvio JSON valido.");
  }
}

function serviceContext() {
  return {
    operationalServices: operationalServices.map((service) => ({
      id: service.id,
      name: service.name,
      plan: service.plan,
      setupPriceBs: service.setupPriceBs ?? null,
      monthlyPriceBs: service.monthlyPriceBs ?? null,
      includes: (service.includes ?? service.deliverables ?? []).slice(0, 6),
      notIncluded: (service.notIncluded ?? []).slice(0, 6),
      risk: service.risk ?? null,
    })),
    vendorCatalog: vendorCommissionRules.map((rule) => ({
      id: rule.id,
      serviceName: rule.serviceName,
      clientPriceLabel: rule.clientPriceLabel,
      offerWhen: rule.offerWhen,
      conditions: rule.conditions.slice(0, 4),
      requiresSergioApproval: Boolean(rule.requiresSergioApproval),
    })),
  };
}

function analysisInstructions() {
  return [
    "Eres el modulo de inteligencia de reuniones de ONIA Center.",
    "Analizas llamadas, audios de WhatsApp, reuniones y transcripts para preparar propuestas comerciales.",
    "No inventes empresa, contacto, presupuesto, alcance, fechas, dolores ni precios si no aparecen en el audio o contexto.",
    "Cuando falte un dato, usa null o el texto exacto por verificar.",
    "No prometas entregables fuera del catalogo ONIA. Marca riesgos y datos faltantes antes de proponer.",
    "Devuelve exclusivamente un objeto JSON valido, sin markdown.",
  ].join("\n");
}

function analysisInput(request: ParsedAudioRequest, transcript: string) {
  const schema = {
    empresa: "string | por verificar",
    contacto: "string | por verificar",
    industria: "string | por verificar",
    ciudad: "string | por verificar",
    necesidad_principal: "string",
    necesidades_secundarias: ["string"],
    presupuesto_mencionado: "string | por verificar",
    objeciones: ["string"],
    nivel_interes: "alto | medio | bajo | por verificar",
    proximo_paso_acordado: "string | por verificar",
    fecha_proximo_paso: "string | por verificar",
    productos_relevantes: ["string"],
    informacion_faltante: ["string"],
    riesgos: ["string"],
    resumen_ejecutivo: "string",
    propuesta_borrador: {
      titulo: "string",
      diagnostico: "string",
      alcance_recomendado: ["string"],
      entregables: ["string"],
      fuera_de_alcance: ["string"],
      precio_sugerido: "string | por verificar",
      condiciones: ["string"],
      siguiente_paso: "string",
    },
    crm_note: "string",
    tareas_sugeridas: ["string"],
  };

  return [
    `Objetivo operativo: ${request.objective}.`,
    `Cliente declarado por el usuario: ${request.clientName || "por verificar"}.`,
    `Contexto adicional: ${request.context || "sin contexto adicional"}.`,
    "",
    "Catalogo ONIA disponible:",
    JSON.stringify(serviceContext()),
    "",
    "Schema requerido:",
    JSON.stringify(schema),
    "",
    "Transcript:",
    transcript,
  ].join("\n");
}

async function analyzeTranscript(config: OpenAIConfig, request: ParsedAudioRequest, transcript: string) {
  const response = await fetch(openAIResponsesUrl(config.baseUrl), {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      instructions: analysisInstructions(),
      input: analysisInput(request, transcript),
      max_output_tokens: config.maxOutputTokens,
      store: false,
    }),
    cache: "no-store",
  });

  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error(`OpenAI ${response.status}: ${bodyText.slice(0, 500)}`);
  }

  const payload = JSON.parse(bodyText) as OpenAIResponse;
  const outputText = extractOpenAIText(payload);
  const analysis = extractJsonObject(outputText);

  return {
    responseId: payload.id ?? null,
    analysis,
  };
}

export async function GET() {
  const configured = isOniaCenterConfigured();
  const openai = getOpenAIConfig();
  const stt = getSttConfig();

  return NextResponse.json({
    ok: true,
    mode: "audio_intelligence_status",
    message: "Audio Intelligence acepta audio o transcript y prepara propuesta interna.",
    requiresLogin: configured,
    localWithoutSupabaseAllowed: allowLocalWithoutSupabase(),
    stt: {
      baseUrlConfigured: Boolean(stt.baseUrl),
      model: stt.model,
      maxFileMb: stt.maxFileMb,
    },
    openai: {
      configured: Boolean(openai.apiKey),
      model: openai.model,
    },
  });
}

export async function POST(request: Request) {
  const configured = isOniaCenterConfigured();
  if (configured) {
    const auth = await getOniaCenterActor(request);
    if (!auth.ok) {
      return authFailureResponse(auth);
    }
  } else if (!allowLocalWithoutSupabase()) {
    return NextResponse.json(
      {
        ok: false,
        mode: "configuration_pending",
        message: "Audio Intelligence necesita login de ONIA Center en produccion antes de procesar audios de clientes.",
        missingConfiguration: getMissingOniaCenterConfig(),
        transcript: null,
        analysis: null,
      },
      { status: 200 },
    );
  }

  let parsed: ParsedAudioRequest;
  try {
    parsed = await parseRequest(request);
  } catch {
    return NextResponse.json(
      { ok: false, mode: "bad_request", message: "Envia multipart/form-data con audio o JSON con transcript.", transcript: null, analysis: null },
      { status: 400 },
    );
  }

  if (!parsed.audioFile && !parsed.transcript) {
    return NextResponse.json(
      { ok: false, mode: "bad_request", message: "Sube un audio o pega un transcript.", transcript: null, analysis: null },
      { status: 400 },
    );
  }

  const stt = getSttConfig();
  const openai = getOpenAIConfig();
  let transcript = parsed.transcript;
  let sttSource = "transcript_manual";

  try {
    if (parsed.audioFile && !transcript) {
      transcript = await transcribeAudio(parsed.audioFile, stt);
      sttSource = "speaches";
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo transcribir el audio.";
    return NextResponse.json(
      {
        ok: false,
        mode: "stt_error",
        message,
        transcript: null,
        analysis: null,
        source: { stt: sttSource, sttBaseUrl: stt.baseUrl, sttModel: stt.model },
      },
      { status: 502 },
    );
  }

  if (!openai.apiKey) {
    return NextResponse.json(
      {
        ok: false,
        mode: "openai_not_configured",
        message: "Transcript listo, pero falta OPENAI_ONIA_CENTER_API_KEY u OPENAI_API_KEY para preparar la propuesta.",
        missingConfiguration: ["OPENAI_ONIA_CENTER_API_KEY"],
        transcript,
        analysis: null,
        source: { stt: sttSource, sttModel: stt.model },
      },
      { status: 200 },
    );
  }

  try {
    const result = await analyzeTranscript(openai, parsed, transcript);
    return NextResponse.json({
      ok: true,
      mode: "audio_intelligence",
      message: "Analisis preparado para revision interna. No enviar al cliente sin validacion humana.",
      transcript,
      analysis: result.analysis,
      responseId: result.responseId,
      source: {
        stt: sttSource,
        sttModel: sttSource === "speaches" ? stt.model : null,
        analysisProvider: "openai",
        analysisModel: openai.model,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo analizar el transcript.";
    return NextResponse.json(
      {
        ok: false,
        mode: "openai_error",
        message,
        transcript,
        analysis: null,
        source: { stt: sttSource, sttModel: stt.model, analysisProvider: "openai", analysisModel: openai.model },
      },
      { status: 502 },
    );
  }
}
