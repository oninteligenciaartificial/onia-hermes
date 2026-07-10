// Export SDK del workflow n8n "ONIA - Agente Building in Public".
// Cron Lunes 07:25 La Paz (semanal) -> SSH corre /opt/onia/building-public-agent-run.sh (docker
// exec onia-center node building-public-agent.mjs): lee el repo-pulse (commits por carril),
// escribe onia_center.dev_pulse (visibilidad de "estamos construyendo todo el tiempo") y deja
// contenido building-in-public SANITIZADO (nunca menciona clientes ni carriles internos crudos)
// en review_queue (pending/sensitive/reviewer=sergio). Avisa a Sergio con el dev-pulse + el guion.
// CREADO DESACTIVADO (2026-07-10) a pedido de Sergio (vacaciones): activar con publish_workflow
// al volver. Generacion pesada (Higgsfield) NO automatica.
// Recrear con create_workflow_from_code; luego setNodeCredential (sshPrivateKey, telegramApi).
import { workflow, node, trigger, ifElse, expr, newCredential } from '@n8n/workflow-sdk';

const cronTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.2,
  config: {
    name: 'Lunes 07:25',
    parameters: { rule: { interval: [{ field: 'cronExpression', expression: '25 7 * * 1' }] } }
  },
  output: [{}]
});

const correrAgente = node({
  type: 'n8n-nodes-base.ssh',
  version: 1,
  config: {
    name: 'Correr Building in Public (VPS)',
    parameters: {
      resource: 'command',
      operation: 'execute',
      authentication: 'privateKey',
      command: 'bash /opt/onia/building-public-agent-run.sh',
      cwd: '/root'
    },
    credentials: { sshPrivateKey: newCredential('ONIA VPS SSH', '4XKauEX3b6cqaDhW') }
  },
  output: [{ stdout: '{"ok":true,"day":"2026-07-09","totalCommits":224,"reviewsCreated":2,"preview":{},"notify":true}', code: 0, stderr: '' }]
});

const prepararAviso = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Preparar aviso',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: "const raw = ($input.first().json.stdout || '').trim();\nlet s;\ntry { s = JSON.parse(raw.split('\\n').pop()); } catch (e) { s = { ok: false, fatal: 'parse', raw: raw.slice(0, 200) }; }\nconst esc = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');\nconst notify = (!s.ok) || (s.notify === true);\nlet text;\nif (!s.ok) {\n  text = 'Building in Public ONIA - ERROR: ' + esc(s.fatal || 'desconocido');\n} else {\n  const p = s.preview || {};\n  const sc = p.script || {};\n  const c = p.carousel || {};\n  const L = [];\n  L.push('<b>Building in Public ONIA — ' + esc(s.day || '') + '</b>');\n  if (s.devText) L.push(esc(s.devText));\n  if (sc.hook || sc.body) {\n    L.push('');\n    L.push('<b>GUION (' + esc(sc.format || 'Reel') + ' · ' + esc(sc.duration || '') + ')</b>');\n    if (sc.hook) L.push('Gancho: ' + esc(sc.hook));\n    if (sc.body) L.push('Desarrollo: ' + esc(sc.body));\n    if (sc.cta) L.push('CTA: ' + esc(sc.cta));\n    if (sc.on_screen) L.push('En pantalla: ' + esc(sc.on_screen));\n    if (sc.visual_prompt) L.push('Prompt visual: ' + esc(sc.visual_prompt));\n    if (sc.voice_tone) L.push('Voz/tono: ' + esc(sc.voice_tone));\n  }\n  if (c && (c.title || (Array.isArray(c.slides) && c.slides.length))) {\n    L.push('');\n    L.push('<b>CARRUSEL: ' + esc(c.title || '') + '</b>');\n    const sl = Array.isArray(c.slides) ? c.slides : [];\n    for (let j = 0; j < sl.length; j++) L.push((j + 1) + '. ' + esc(sl[j]));\n    if (c.cta) L.push('CTA: ' + esc(c.cta));\n  }\n  L.push('');\n  L.push((s.reviewsCreated || 0) + ' borrador(es) building-in-public en revision en ONIA Center. Nada se publica sin tu OK.');\n  text = L.join('\\n').slice(0, 3900);\n}\nreturn [{ json: { notify: notify, text: text } }];"
    }
  },
  output: [{ notify: false, text: '' }]
});

const hayAviso = ifElse({
  version: 2.3,
  config: {
    name: 'Hay algo que avisar?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
        combinator: 'and',
        conditions: [
          { id: 'cond-notify', leftValue: expr('{{ $json.notify }}'), rightValue: '', operator: { type: 'boolean', operation: 'true', singleValue: true } }
        ]
      }
    }
  },
  output: [{ notify: true, text: 'x' }]
});

const avisarSergio = node({
  type: 'n8n-nodes-base.telegram',
  version: 1.2,
  config: {
    name: 'Avisar a Sergio',
    parameters: {
      resource: 'message',
      operation: 'sendMessage',
      chatId: '6830070978',
      text: expr('{{ $json.text }}'),
      additionalFields: { appendAttribution: false, disable_web_page_preview: true, parse_mode: 'HTML' }
    },
    credentials: { telegramApi: newCredential('Telegram account', 'r8y2CN5RyOEIDce3') }
  },
  output: [{ ok: true }]
});

export default workflow('onia-agente-building-public', 'ONIA - Agente Building in Public')
  .add(cronTrigger)
  .to(correrAgente)
  .to(prepararAviso)
  .to(hayAviso.onTrue(avisarSergio));
