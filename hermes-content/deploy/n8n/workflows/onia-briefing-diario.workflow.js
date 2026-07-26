// Export SDK del workflow n8n "ONIA Center - Briefing diario operativo" (id ONIADailyBrief001).
// Cron Lun-Sab 06:45 (La Paz). Lee primero el repo pulse (SSH cat del JSON generado por
// .github/workflows/repo-pulse.yml) y despues corre el briefing diario DENTRO de onia-center
// por SSH (docker exec onia-center node - < briefing-run.mjs), que lee la
// ONIA_CENTER_INTERNAL_API_KEY del contenedor -> genera+registra el plan por rol (deduplicado)
// -> arma el resumen (plan + actividad de repo por carril) y avisa a Sergio por Telegram
// (credencial). SIN $env: la key nunca sale del contenedor; chat ID hardcodeado; token de
// Telegram en credencial n8n. Fan-out del Code: Telegram + calendario (no-op).
// Recrear con create_workflow_from_code; luego setNodeCredential (sshPrivateKey, telegramApi).
import { workflow, node, trigger } from '@n8n/workflow-sdk';

const scheduleTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.2,
  config: {
    name: 'Lunes a sabado 06:45',
    parameters: { rule: { interval: [{ field: 'cronExpression', expression: '45 6 * * 1-6' }] } }
  }
});

const leerRepoPulse = node({
  type: 'n8n-nodes-base.ssh',
  version: 1,
  config: {
    name: 'Leer repo pulse',
    parameters: { resource: 'command', operation: 'execute', authentication: 'privateKey', command: "cat /opt/onia/state/repo-pulse-latest.json 2>/dev/null || echo '{}'", cwd: '/root' },
    credentials: { sshPrivateKey: { id: '4XKauEX3b6cqaDhW', name: 'ONIA VPS SSH' } }
  }
});

const correrBriefing = node({
  type: 'n8n-nodes-base.ssh',
  version: 1,
  config: {
    name: 'Correr briefing (VPS)',
    parameters: { resource: 'command', operation: 'execute', authentication: 'privateKey', command: 'bash /opt/onia/briefing-run.sh', cwd: '/root' },
    credentials: { sshPrivateKey: { id: '4XKauEX3b6cqaDhW', name: 'ONIA VPS SSH' } }
  }
});

const prepararResumen = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Preparar resumen Telegram',
    parameters: {
      jsCode: "let pulse = {};\ntry {\n  const pulseRaw = (($('Leer repo pulse').first().json.stdout) || '{}').trim();\n  pulse = JSON.parse(pulseRaw) || {};\n} catch (e) {\n  pulse = {};\n}\nconst raw = ((items[0].json.stdout) || '').trim();\nlet payload;\ntry { payload = JSON.parse(raw); } catch (e) { payload = { ok: false, message: 'Briefing: no se pudo parsear la respuesta del VPS.' }; }\nconst data = payload.data || {};\nconst roles = Array.isArray(data.roles) ? data.roles : [];\nconst result = payload.result || {};\nconst date = data.date || new Date().toISOString().slice(0, 10);\nconst createdTasks = Array.isArray(result.createdTasks) ? result.createdTasks.length : (typeof result.createdTasks === 'number' ? result.createdTasks : 0);\nconst skippedTasks = Array.isArray(result.skippedTasks) ? result.skippedTasks.length : (typeof result.skippedTasks === 'number' ? result.skippedTasks : 0);\nconst lines = [\n  `ONIA Center | Plan diario ${date}`,\n  payload.message || 'Briefing generado.',\n  `Tareas nuevas: ${createdTasks}. Omitidas por duplicado: ${skippedTasks}.`,\n  '',\n];\nif (pulse && typeof pulse.totalCommits === 'number') {\n  lines.push(`Repo (ultimas ${pulse.lookbackHours || '?'}h): ${pulse.totalCommits} commits.`);\n  const topLanes = (pulse.byLane || []).slice(0, 5).map((l) => `${l.lane} (${l.commits})`).join(', ');\n  if (topLanes) lines.push(`Carriles activos: ${topLanes}`);\n  const stale = (pulse.staleLanes || []).slice(0, 5).map((l) => `${l.lane}${l.daysSinceLastCommit != null ? ' (' + l.daysSinceLastCommit + 'd)' : ' (sin historial)'}`);\n  if (stale.length) lines.push(`Sin actividad: ${stale.join(', ')}`);\n  lines.push('');\n}\nfor (const role of roles) {\n  const tasks = Array.isArray(role.topTasks) ? role.topTasks.slice(0, 5) : [];\n  lines.push(`${String(role.role || '').toUpperCase()}: ${role.summary || 'Sin resumen.'}`);\n  for (const task of tasks) {\n    lines.push(`- ${task.timeBlock || 'sin bloque'} | ${task.title || 'Tarea sin titulo'}`);\n  }\n  lines.push('');\n}\nlines.push('Regla: solo cuenta si queda registrado con evidencia. n8n agenda y avisa; Sergio aprueba pagos, descuentos, gastos y uso premium.');\nconst text = lines.join('\\n').slice(0, 3900);\nreturn [{\n  json: {\n    ok: Boolean(payload.ok),\n    mode: payload.mode,\n    date,\n    text,\n    calendarBlocks: Array.isArray(data.calendarBlocks) ? data.calendarBlocks : [],\n    createdTasks,\n    skippedTasks,\n    repoPulse: pulse\n  }\n}];"
    }
  }
});

const avisarSergio = node({
  type: 'n8n-nodes-base.telegram',
  version: 1.2,
  config: {
    name: 'Avisar a Sergio',
    parameters: { resource: 'message', operation: 'sendMessage', chatId: '6830070978', text: '={{ $json.text }}', additionalFields: { appendAttribution: false, disable_web_page_preview: true } },
    credentials: { telegramApi: { id: 'r8y2CN5RyOEIDce3', name: 'Telegram account' } }
  }
});

const prepararCalendario = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Preparar calendario protegido',
    parameters: {
      jsCode: "const item = items[0].json;\nreturn [{\n  json: {\n    ok: item.ok,\n    mode: item.mode,\n    date: item.date,\n    calendarReady: false,\n    calendarBlocks: item.calendarBlocks,\n    note: 'Google Calendar queda preparado. Activar escritura solo despues de OAuth y prueba manual.'\n  }\n}];"
    }
  }
});

export default workflow('onia-briefing-diario', 'ONIA Center - Briefing diario operativo')
  .add(scheduleTrigger)
  .to(leerRepoPulse)
  .to(correrBriefing)
  .to(prepararResumen)
  .to(avisarSergio)
  .add(prepararResumen)
  .to(prepararCalendario);
