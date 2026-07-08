#!/usr/bin/env node
// Subida a YouTube Data API v3 para "La Ciencia de tu Cuerpo".
// DRY-RUN por defecto: nunca llama a la API real sin --live explicito.
// Nunca sube en publico directamente: privacyStatus siempre private/unlisted,
// publicar es un paso manual y separado (ver pipeline/approval-matrix.json).
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { google } from "googleapis";
import { parseMetadata } from "../pipeline/schemas.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const CLIENT_SECRET_PATH =
  process.env.YT_CLIENT_SECRET_PATH ??
  path.join(ROOT, "credentials", "client_secret.json");
const TOKEN_PATH =
  process.env.YT_TOKEN_PATH ?? path.join(ROOT, "credentials", "token.json");
const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];
const REDIRECT_PORT = Number(process.env.YT_OAUTH_PORT ?? 53682);
const EDUCATION_CATEGORY_ID = "27";

function parseArgs(argv) {
  const args = { dryRun: true, privacy: "private" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--live") args.dryRun = false;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--video") args.video = argv[++i];
    else if (a === "--metadata") args.metadataPath = argv[++i];
    else if (a === "--privacy") args.privacy = argv[++i];
  }
  return args;
}

async function loadClientSecret() {
  let raw;
  try {
    raw = await readFile(CLIENT_SECRET_PATH, "utf8");
  } catch {
    throw new Error(
      `No encuentro credenciales OAuth en ${CLIENT_SECRET_PATH}.\n` +
        "Bloqueo real (Sergio): crear un proyecto en Google Cloud con YouTube\n" +
        'Data API v3 habilitada, credencial OAuth 2.0 tipo "Desktop app",\n' +
        "descargar el client_secret.json y guardarlo en esa ruta (o apuntar\n" +
        "YT_CLIENT_SECRET_PATH a donde este). Sin pasar la auditoria de\n" +
        "compliance de Google, YouTube fuerza las subidas a privado igual —\n" +
        "eso no bloquea probar este script, solo bloquea que algun dia se\n" +
        "pueda subir publico. Ver PLAN.md #9.",
    );
  }
  const parsed = JSON.parse(raw);
  return parsed.installed ?? parsed.web;
}

async function loadSavedToken() {
  try {
    return JSON.parse(await readFile(TOKEN_PATH, "utf8"));
  } catch {
    return null;
  }
}

async function saveToken(tokens) {
  await mkdir(path.dirname(TOKEN_PATH), { recursive: true });
  await writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2), "utf8");
}

async function getAuthorizedClient() {
  const secret = await loadClientSecret();
  const redirectUri = `http://localhost:${REDIRECT_PORT}/oauth2callback`;
  const oauth2Client = new google.auth.OAuth2(
    secret.client_id,
    secret.client_secret,
    redirectUri,
  );

  const saved = await loadSavedToken();
  if (saved) {
    oauth2Client.setCredentials(saved);
    return oauth2Client;
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  console.log("Abrí esta URL para autorizar la subida a YouTube (una sola vez):");
  console.log(authUrl);

  const code = await new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, redirectUri);
      if (url.pathname !== "/oauth2callback") {
        res.end();
        return;
      }
      const authCode = url.searchParams.get("code");
      res.end("Autorización recibida, ya podés cerrar esta pestaña.");
      server.close();
      if (authCode) resolve(authCode);
      else reject(new Error("No llegó el parámetro 'code' en el callback de OAuth."));
    });
    server.listen(REDIRECT_PORT);
  });

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  await saveToken(tokens);
  return oauth2Client;
}

function buildRequestBody(metadata, privacy) {
  return {
    snippet: {
      title: metadata.title_final || metadata.title_options[0],
      description: metadata.description,
      tags: metadata.tags,
      categoryId: EDUCATION_CATEGORY_ID,
      defaultLanguage: metadata.language,
      defaultAudioLanguage: metadata.language,
    },
    status: {
      privacyStatus: privacy,
      selfDeclaredMadeForKids: metadata.made_for_kids,
      // Disclosure IA — regla dura del canal, ver PLAN.md #1 y #7.
      // Campo real de la API (status.containsSyntheticMedia), verificado
      // 2026-07-08: https://developers.google.com/youtube/v3/docs/videos
      containsSyntheticMedia: metadata.contains_synthetic_media,
    },
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.metadataPath) {
    console.error(
      "Uso: node scripts/upload-youtube.mjs --metadata <episodio>/metadata.json " +
        "[--video <archivo.mp4>] [--live] [--privacy private|unlisted]",
    );
    process.exit(1);
  }

  if (args.privacy !== "private" && args.privacy !== "unlisted") {
    throw new Error(
      "Este script nunca sube en publico directamente (privacy solo acepta " +
        "'private' o 'unlisted'). Publicar es un paso manual y separado, tras " +
        "aprobacion explicita de Sergio — ver pipeline/approval-matrix.json.",
    );
  }

  const metadata = parseMetadata(
    JSON.parse(await readFile(args.metadataPath, "utf8")),
  );
  const requestBody = buildRequestBody(metadata, args.privacy);

  console.log(`Modo: ${args.dryRun ? "DRY-RUN (no llama a la API real)" : "LIVE"}`);
  console.log(JSON.stringify(requestBody, null, 2));

  if (args.dryRun) {
    console.log(
      "\nDRY-RUN OK. No se subió nada. Para subir de verdad: --live --video " +
        "<archivo.mp4>, y solo después de la aprobación de Sergio " +
        "('Apruebo subida privada YouTube: <content_id>').",
    );
    return;
  }

  if (!args.video) {
    throw new Error("--live requiere --video <archivo.mp4>");
  }

  const auth = await getAuthorizedClient();
  const youtube = google.youtube({ version: "v3", auth });

  const res = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody,
    media: { body: createReadStream(args.video) },
  });

  console.log(`Subido. videoId=${res.data.id} privacyStatus=${res.data.status?.privacyStatus}`);
  console.log(`Editar/revisar (no público): https://studio.youtube.com/video/${res.data.id}/edit`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
