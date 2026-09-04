#!/usr/bin/env node
// Cola + render del analisis escena por escena (Higgsfield `video_analysis_create`).
// Ficha madre: hermes-content/references/video-intake/2026-08-19-la-herramienta-lee-el-video.md
//
// El MCP de Higgsfield solo es accesible desde una sesion de Claude (OAuth del conector;
// NO hay API key en ningun lado, y asi debe quedar). Por eso el intake ENCOLA
// (scripts/video-intake.mjs, solo videos < 3 min) y una sesion con el MCP drena la cola
// con este script. Flujo del drenado (lo ejecuta el agente):
//
//   1. node scripts/video-scenes.mjs next        # entrega hasta TOPE pendientes (JSON)
//   2. por cada uno: media_upload -> curl PUT del mp4 -> media_confirm ->
//      balance (ANTES) -> video_analysis_create ->
//      node scripts/video-scenes.mjs mark <sc> --analyze-id <uuid>
//   3. NO bloquearse esperando: el analisis tarda 3-5 min; crear TODOS primero y seguir
//      con otra cosa. Despues, por cada uno: video_analysis_status hasta completed ->
//      guardar la respuesta JSON en un archivo -> balance (DESPUES) ->
//      node scripts/video-scenes.mjs save <sc> --scenes r.json --analyze-id <uuid> \
//        --balance-antes A --balance-despues B
//   4. si algo fallo: node scripts/video-scenes.mjs fail <sc> --reason "..."
//
// TOPE por corrida: ONIA_SCENES_TOPE (default 10) o `next --tope N`.
// El analisis debe ser GRATIS (medido 2026-08-19). Si el balance BAJA tras un analisis,
// `save` corta: crea .hermes/video-intake/scenes-PAUSADO y sale con codigo 3; `next` se
// niega a entregar hasta que un humano revise y borre ese archivo.

import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const esMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

const REPO = path.resolve(import.meta.dirname, '..');
const BASE = path.join(REPO, '.hermes', 'video-intake');
const QUEUE = path.join(BASE, 'scenes-queue.jsonl');
const PAUSADO = path.join(BASE, 'scenes-PAUSADO');
const ANALISIS = path.join(REPO, 'hermes-content', 'references', 'video-intake', 'analisis');
const CORRIDAS = path.join(ANALISIS, 'CORRIDAS.log');
const hoy = () => new Date().toISOString().slice(0, 10);

const leerCola = () =>
  !existsSync(QUEUE)
    ? []
    : readFileSync(QUEUE, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const escribirCola = (es) =>
  writeFileSync(QUEUE, es.map((e) => JSON.stringify(e)).join('\n') + (es.length ? '\n' : ''));
const log = (linea) => {
  mkdirSync(ANALISIS, { recursive: true });
  appendFileSync(CORRIDAS, `${new Date().toISOString()} ${linea}\n`);
};

/** Segundos (o "M:SS" ya formateado) -> "M:SS". */
export function fmtTiempo(v) {
  if (typeof v === 'string' && v.includes(':')) return v;
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v ?? '?');
  return `${Math.floor(n / 60)}:${String(Math.round(n % 60)).padStart(2, '0')}`;
}

const celda = (v) => String(v ?? '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();

/**
 * Respuesta de video_analysis_status -> markdown con el formato de
 * analisis/DcMW3Coi6BN-escenas.md. Tolerante a nombres de campo (la salida real
 * trae timestamp_start/timestamp_end/shot_type/label + descripciones).
 */
export function renderEscenas(sc, data, meta = {}) {
  const escenas = data?.scenes || data?.data?.scenes || (Array.isArray(data) ? data : null);
  if (!escenas?.length) throw new Error('la respuesta no trae scenes');
  const filas = escenas.map((s, i) => {
    const t = `${fmtTiempo(s.timestamp_start ?? s.start)}–${fmtTiempo(s.timestamp_end ?? s.end)}`;
    return `| ${i + 1} | ${t} | ${celda(s.label)} | ${celda(s.shot_type ?? s.shot)} | ${celda(
      s.visual_description ?? s.description ?? s.visual,
    )} | ${celda(s.audio_description ?? s.audio)} |`;
  });
  const balance =
    meta.balanceAntes != null
      ? `creditos ${meta.balanceAntes} antes / ${meta.balanceDespues} despues`
      : 'balance no medido';
  return [
    `# ${sc} — análisis escena por escena (Higgsfield \`video_analysis_create\`)`,
    '',
    `Salida literal de la herramienta. ${escenas.length} escenas${meta.dur ? `, ${meta.dur} s` : ''}. ` +
      `Corrida ${meta.fecha || hoy()}, ${balance}.` +
      (meta.analyzeId ? ` \`video_analyze_id: ${meta.analyzeId}\`` : ''),
    '',
    '| # | Tiempo | Función (`label`) | Plano | Visual | Audio |',
    '|---|---|---|---|---|---|',
    ...filas,
    '',
  ].join('\n');
}

if (esMain) {
  const [cmd, sc] = process.argv.slice(2);
  const flag = (n) => {
    const i = process.argv.indexOf(n);
    return i === -1 ? undefined : process.argv[i + 1];
  };
  const cola = leerCola();
  const entrada = sc ? cola.find((e) => e.sc === sc) : undefined;

  if (cmd === 'next') {
    if (existsSync(PAUSADO)) {
      console.error(`COLA PAUSADA — ${readFileSync(PAUSADO, 'utf8').trim()}`);
      console.error(`Revisar y borrar ${PAUSADO} para reanudar.`);
      process.exit(3);
    }
    const tope = Number(flag('--tope') || process.env.ONIA_SCENES_TOPE || 10);
    const pendientes = cola.filter((e) => e.estado === 'pendiente');
    const entrega = pendientes.slice(0, tope);
    console.error(`escenas: tope=${tope} pendientes=${pendientes.length} entregados=${entrega.length}`);
    console.log(JSON.stringify(entrega, null, 2));
  } else if (cmd === 'mark') {
    if (!entrada) throw new Error(`no esta en la cola: ${sc}`);
    Object.assign(entrada, { estado: 'corriendo', analyzeId: flag('--analyze-id'), mediaId: flag('--media-id') });
    escribirCola(cola);
    console.log(`corriendo\t${sc}\t${entrada.analyzeId}`);
  } else if (cmd === 'save') {
    const data = JSON.parse(readFileSync(flag('--scenes'), 'utf8'));
    const antes = flag('--balance-antes');
    const despues = flag('--balance-despues');
    const md = renderEscenas(sc, data, {
      dur: entrada?.dur,
      analyzeId: flag('--analyze-id') || entrada?.analyzeId,
      balanceAntes: antes,
      balanceDespues: despues,
      fecha: hoy(),
    });
    mkdirSync(ANALISIS, { recursive: true });
    const destino = path.join(ANALISIS, `${sc}-escenas.md`);
    writeFileSync(destino, md);
    if (entrada) {
      entrada.estado = 'hecho';
      escribirCola(cola);
      rmSync(entrada.mp4, { force: true }); // el spool ya cumplio
    }
    const escenas = md.split('\n').filter((l) => /^\| \d/.test(l)).length;
    log(`hecho ${sc} escenas=${escenas} balance=${antes}->${despues} id=${flag('--analyze-id') || entrada?.analyzeId || '?'}`);
    console.log(`OK\t${sc}\t${escenas} escenas\t${destino}`);
    if (antes != null && despues != null && Number(despues) < Number(antes) - 1e-6) {
      const alerta = `el analisis de ${sc} GASTO creditos (${antes} -> ${despues}); se suponia gratis. Cola cortada ${new Date().toISOString()}.`;
      mkdirSync(BASE, { recursive: true });
      writeFileSync(PAUSADO, alerta + '\n');
      log(`ALERTA ${alerta}`);
      console.error(`ALERTA: ${alerta}`);
      process.exit(3);
    }
  } else if (cmd === 'fail') {
    if (!entrada) throw new Error(`no esta en la cola: ${sc}`);
    entrada.estado = 'fallo';
    entrada.razon = flag('--reason') || 'sin razon';
    escribirCola(cola);
    log(`fallo ${sc} razon=${entrada.razon}`);
    console.log(`fallo\t${sc}\t${entrada.razon}`);
  } else {
    console.error('uso: video-scenes.mjs next [--tope N] | mark <sc> --analyze-id ID | save <sc> --scenes r.json --balance-antes A --balance-despues B | fail <sc> --reason "..."');
    process.exit(1);
  }
}
