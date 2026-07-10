#!/usr/bin/env node
// Subida a TikTok Content Posting API para "La Ciencia de tu Cuerpo".
// DRY-RUN por defecto. SIEMPRE usa post_mode MEDIA_UPLOAD (bandeja de
// entrada) via /v2/post/publish/inbox/video/init/ -- el video NO se publica
// solo, llega al inbox de TikTok y una persona lo termina de publicar a mano
// adentro de la app. Este script nunca implementa DIRECT_POST: ese modo
// publicaria sin pasar por un humano, y esta prohibido en este canal (ver
// PLAN.md #10 y pipeline/approval-matrix.json).
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseShortsPlan } from "../pipeline/schemas.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const TOKEN_PATH =
  process.env.TT_TOKEN_PATH ?? path.join(ROOT, "credentials", "tiktok_token.json");
const API_BASE = "https://open.tiktokapis.com/v2";
// Limite documentado del ultimo/unico chunk de la Media Transfer Guide de TikTok.
const MAX_SINGLE_CHUNK_BYTES = 128 * 1024 * 1024;

function parseArgs(argv) {
  const args = { dryRun: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--live") args.dryRun = false;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--video") args.video = argv[++i];
    else if (a === "--shorts-plan") args.shortsPlanPath = argv[++i];
    else if (a === "--short-id") args.shortId = argv[++i];
  }
  return args;
}

async function loadAccessToken() {
  try {
    const raw = await readFile(TOKEN_PATH, "utf8");
    const { access_token } = JSON.parse(raw);
    if (!access_token) throw new Error("token sin access_token");
    return access_token;
  } catch {
    throw new Error(
      `No encuentro token de TikTok en ${TOKEN_PATH}.\n` +
        "Bloqueo real (Sergio): registrar una app en TikTok for Developers\n" +
        "(https://developers.tiktok.com/), pedir el scope 'video.upload'\n" +
        "(modo bandeja — NO 'video.publish', que es publicacion directa) y\n" +
        "completar el flujo OAuth para obtener un access_token. Mientras la\n" +
        "app no pase la auditoria de TikTok (2-6 semanas), el contenido queda\n" +
        "restringido a solo-privado igual — mismo espiritu que el bloqueo de\n" +
        "YouTube. Ver PLAN.md #10.",
    );
  }
}

function findShort(plan, shortId) {
  const short = shortId
    ? plan.shorts.find((s) => s.id === shortId)
    : plan.shorts[0];
  if (!short) {
    throw new Error(
      shortId
        ? `No encontre el short con id "${shortId}" en el shorts-plan.`
        : "El shorts-plan no tiene ningun short.",
    );
  }
  return short;
}

function buildInitBody(short, videoSizeBytes) {
  return {
    post_info: {
      title: short.caption,
      privacy_level: "SELF_ONLY",
      disable_duet: false,
      disable_comment: false,
      disable_stitch: false,
    },
    source_info: {
      source: "FILE_UPLOAD",
      video_size: videoSizeBytes,
      chunk_size: videoSizeBytes,
      total_chunk_count: 1,
    },
  };
}

async function queryCreatorInfo(accessToken) {
  const res = await fetch(`${API_BASE}/post/publish/creator_info/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
  if (!res.ok) {
    throw new Error(`creator_info/query falló: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.shortsPlanPath) {
    console.error(
      "Uso: node scripts/upload-tiktok.mjs --shorts-plan <episodio>/shorts-plan.json " +
        "[--short-id <id>] [--video <archivo.mp4>] [--live]",
    );
    process.exit(1);
  }

  const plan = parseShortsPlan(JSON.parse(await readFile(args.shortsPlanPath, "utf8")));
  const short = findShort(plan, args.shortId);

  if (!short.target_platforms.includes("tiktok")) {
    throw new Error(`El short "${short.id}" no tiene "tiktok" en target_platforms.`);
  }

  console.log(
    `Modo: ${args.dryRun ? "DRY-RUN (no llama a la API real)" : "LIVE"} — ` +
      "post_mode forzado a MEDIA_UPLOAD (bandeja), nunca DIRECT_POST",
  );
  console.log(JSON.stringify(buildInitBody(short, 0), null, 2));

  if (args.dryRun) {
    console.log(
      "\nDRY-RUN OK. No se subió nada.\nRecordatorio: la API de TikTok no expone " +
        "hoy un campo de disclosure IA equivalente a containsSyntheticMedia — " +
        "Sergio debe activar el toggle 'AI-generated content' a mano al terminar " +
        "de publicar desde el inbox de la app.",
    );
    return;
  }

  if (!args.video) {
    throw new Error("--live requiere --video <archivo.mp4>");
  }

  const { size } = await stat(args.video);
  if (size > MAX_SINGLE_CHUNK_BYTES) {
    throw new Error(
      `El archivo pesa ${size} bytes y supera el límite de un solo chunk ` +
        "(128MB) que soporta esta v1 del script. Falta implementar upload " +
        "multi-chunk para archivos más grandes.",
    );
  }

  const accessToken = await loadAccessToken();

  // Paso requerido por la API antes de publicar (trae opciones de
  // privacidad y duración máxima habilitadas para este creador).
  await queryCreatorInfo(accessToken);

  const initRes = await fetch(`${API_BASE}/post/publish/inbox/video/init/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(buildInitBody(short, size)),
  });
  if (!initRes.ok) {
    throw new Error(`inbox/video/init falló: ${initRes.status} ${await initRes.text()}`);
  }
  const initData = await initRes.json();
  const uploadUrl = initData.data?.upload_url;
  if (!uploadUrl) {
    throw new Error("La respuesta de init no trajo upload_url.");
  }

  const videoBuffer = await readFile(args.video);
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "video/mp4",
      "Content-Range": `bytes 0-${size - 1}/${size}`,
    },
    body: videoBuffer,
  });
  if (!putRes.ok) {
    throw new Error(`PUT del video falló: ${putRes.status} ${await putRes.text()}`);
  }

  console.log(`Enviado a la bandeja de TikTok. publish_id=${initData.data?.publish_id}`);
  console.log(
    "Sergio: abrir la app de TikTok, revisar el borrador en notificaciones, " +
      "activar 'AI-generated content' y recién ahí publicar a mano.",
  );
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
