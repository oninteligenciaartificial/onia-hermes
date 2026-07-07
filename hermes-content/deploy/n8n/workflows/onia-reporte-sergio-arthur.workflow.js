// Export SDK del workflow n8n "ONIA - Reporte diario Sergio + Arthur" (id xQaO3Sfsl9XzMiid).
// Cron Lun-Sab 07:00 La Paz -> lee el repo pulse (SSH cat, generado por
// .github/workflows/repo-pulse.yml) -> lee el docs hygiene (SSH cat, generado por
// .github/workflows/docs-hygiene-daily.yml: duplicados raiz<->hermes-content/docs) ->
// SSH `docker exec -i onia-center node - < /opt/onia/arthur-report.mjs`: da las tareas
// del dia a Sergio y a Arthur (obligaciones del acuerdo 60 dias + CRM vivo) y verifica
// las ganancias de Arthur (payment_commissions por estado + ventas + progreso trial).
// Determinista (sin LLM); solo suma lo REGISTRADO. El Code final agrega la seccion de
// actividad de repo (commits por carril) y la de docs hygiene (auto-limpiados +
// divergentes/nuevos en raiz para que Sergio decida) al texto que arma el propio
// script. Telegram a Sergio con parse_mode HTML (el default sin setear comia los "_"
// de los nombres de archivo como italica de Markdown legacy; probado en vivo antes/
// despues del fix: message_id 774 con nombres rotos, 775 ya con nombres intactos).
// Recrear con create_workflow_from_code; luego setNodeCredential (sshPrivateKey, telegramApi).
import { workflow, node, trigger, expr, newCredential } from '@n8n/workflow-sdk';

const cronTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.2,
  config: { name: 'Lun-Sab 07:00', parameters: { rule: { interval: [{ field: 'cronExpression', expression: '0 7 * * 1-6' }] } } },
  output: [{}]
});

const leerRepoPulse = node({
  type: 'n8n-nodes-base.ssh',
  version: 1,
  config: {
    name: 'Leer repo pulse',
    parameters: { resource: 'command', operation: 'execute', authentication: 'privateKey', command: "cat /opt/onia/state/repo-pulse-latest.json 2>/dev/null || echo '{}'", cwd: '/root' },
    credentials: { sshPrivateKey: newCredential('ONIA VPS SSH', '4XKauEX3b6cqaDhW') }
  },
  output: [{ stdout: '{"totalCommits":0,"byLane":[],"staleLanes":[]}', code: 0, stderr: '' }]
});

const leerDocsHygiene = node({
  type: 'n8n-nodes-base.ssh',
  version: 1,
  config: {
    name: 'Leer docs hygiene',
    parameters: { resource: 'command', operation: 'execute', authentication: 'privateKey', command: "cat /opt/onia/state/docs-hygiene-latest.json 2>/dev/null || echo '{}'", cwd: '/root' },
    credentials: { sshPrivateKey: newCredential('ONIA VPS SSH', '4XKauEX3b6cqaDhW') }
  },
  output: [{ stdout: '{"totals":{"identicalDeleted":0,"divergent":0,"newInRoot":0},"divergentFindings":[],"newInRootFindings":[]}', code: 0, stderr: '' }]
});

const correrReporte = node({
  type: 'n8n-nodes-base.ssh',
  version: 1,
  config: {
    name: 'Reporte Sergio + Arthur (VPS)',
    parameters: { resource: 'command', operation: 'execute', authentication: 'privateKey', command: 'docker exec -i onia-center node - < /opt/onia/arthur-report.mjs', cwd: '/root' },
    credentials: { sshPrivateKey: newCredential('ONIA VPS SSH', '4XKauEX3b6cqaDhW') }
  },
  output: [{ stdout: '{"ok":true,"day":17,"text":"ONIA - Plan del dia..."}', code: 0, stderr: '' }]
});

const extraerTexto = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Extraer texto',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: "let pulse = {};\ntry {\n  const pulseRaw = (($('Leer repo pulse').first().json.stdout) || '{}').trim();\n  pulse = JSON.parse(pulseRaw) || {};\n} catch (e) {\n  pulse = {};\n}\nlet docsHygiene = {};\ntry {\n  const docsRaw = (($('Leer docs hygiene').first().json.stdout) || '{}').trim();\n  docsHygiene = JSON.parse(docsRaw) || {};\n} catch (e) {\n  docsHygiene = {};\n}\nconst raw = ($input.first().json.stdout || '').trim();\nlet s;\ntry { s = JSON.parse(raw.split('\\n').pop()); } catch (e) { s = { ok: false, error: 'parse' }; }\nlet text = s.ok ? s.text : ('Reporte Arthur - ERROR: ' + (s.error || 'desconocido'));\nif (s.ok && pulse && typeof pulse.totalCommits === 'number') {\n  const topLanes = (pulse.byLane || []).slice(0, 5).map((l) => `${l.lane} (${l.commits})`).join(', ');\n  const stale = (pulse.staleLanes || []).slice(0, 5).map((l) => `${l.lane}${l.daysSinceLastCommit != null ? ' (' + l.daysSinceLastCommit + 'd)' : ' (sin historial)'}`);\n  const lines = [`Repo (ultimas ${pulse.lookbackHours || '?'}h): ${pulse.totalCommits} commits.`];\n  if (topLanes) lines.push(`Carriles activos: ${topLanes}`);\n  if (stale.length) lines.push(`Sin actividad: ${stale.join(', ')}`);\n  text = text + '\\n\\n' + lines.join('\\n');\n}\nif (s.ok && docsHygiene && docsHygiene.totals) {\n  const t = docsHygiene.totals;\n  const dLines = [`Docs (limpieza diaria): ${t.identicalDeleted} auto-limpiados, ${t.divergent} divergentes, ${t.newInRoot} nuevos en raiz.`];\n  const topDiv = (docsHygiene.divergentFindings || []).slice(0, 5).map((f) => `  - ${f.relPath} vs ${(f.twins && f.twins[0] && f.twins[0].relPath) || '?'}`);\n  if (topDiv.length) { dLines.push('Divergentes (fusion manual):'); dLines.push(...topDiv); }\n  if ((docsHygiene.divergentFindings || []).length > 5) dLines.push(`  ...+${docsHygiene.divergentFindings.length - 5} mas`);\n  const topNew = (docsHygiene.newInRootFindings || []).slice(0, 5).map((f) => `  - ${f.relPath}`);\n  if (topNew.length) { dLines.push('Nuevos en raiz (mover a docs/):'); dLines.push(...topNew); }\n  if ((docsHygiene.newInRootFindings || []).length > 5) dLines.push(`  ...+${docsHygiene.newInRootFindings.length - 5} mas`);\n  text = text + '\\n\\n' + dLines.join('\\n');\n}\nreturn [{ json: { text: text } }];"
    }
  },
  output: [{ text: 'ONIA - Plan del dia...' }]
});

const avisarSergio = node({
  type: 'n8n-nodes-base.telegram',
  version: 1.2,
  config: {
    name: 'Enviar a Sergio',
    parameters: { resource: 'message', operation: 'sendMessage', chatId: '6830070978', text: expr('{{ $json.text }}'), additionalFields: { appendAttribution: false, disable_web_page_preview: true, parse_mode: 'HTML' } },
    credentials: { telegramApi: newCredential('Telegram account', 'r8y2CN5RyOEIDce3') }
  },
  output: [{ ok: true }]
});

export default workflow('onia-reporte-sergio-arthur', 'ONIA - Reporte diario Sergio + Arthur')
  .add(cronTrigger)
  .to(leerRepoPulse)
  .to(leerDocsHygiene)
  .to(correrReporte)
  .to(extraerTexto)
  .to(avisarSergio);
