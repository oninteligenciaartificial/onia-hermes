// Export SDK del workflow n8n "ONIA - Agente Contenido y Media Lab (borradores)".
// Cron Lun-Sab 07:20 La Paz -> SSH corre /opt/onia/content-media-agent-run.sh (docker exec
// onia-center node content-media-agent.mjs): elige pilar/idea, redacta con LiteLLM SOLO TEXTO
// (1 guion "que grabar hoy" + 1-2 carruseles), deja cada pieza en review_queue
// (pending/sensitive/reviewer=sergio) + pone agent_content_media en 'ready', y avisa a Sergio
// por Telegram con el GUION COMPLETO + carruseles (reemplaza al viejo "Guiones Diarios"
// NDXLJiR00ciQx72V, archivado 2026-07-09). La generacion PESADA (Higgsfield) NO es automatica.
// Recrear con create_workflow_from_code; luego setNodeCredential (sshPrivateKey, telegramApi).
import { workflow, node, trigger, ifElse, expr, newCredential } from '@n8n/workflow-sdk';

const cronTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.2,
  config: {
    name: 'Lun-Sab 07:20',
    parameters: { rule: { interval: [{ field: 'cronExpression', expression: '20 7 * * 1-6' }] } }
  },
  output: [{}]
});

const correrAgente = node({
  type: 'n8n-nodes-base.ssh',
  version: 1,
  config: {
    name: 'Correr Agente Contenido (VPS)',
    parameters: {
      resource: 'command',
      operation: 'execute',
      authentication: 'privateKey',
      command: 'bash /opt/onia/content-media-agent-run.sh',
      cwd: '/root'
    },
    credentials: { sshPrivateKey: newCredential('ONIA VPS SSH', '4XKauEX3b6cqaDhW') }
  },
  output: [{ stdout: '{"ok":true,"day":"2026-07-09","pillar":"...","reviewsCreated":3,"preview":{},"notify":true}', code: 0, stderr: '' }]
});

const prepararAviso = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Preparar aviso',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: "const raw = ($input.first().json.stdout || '').trim();\nlet s;\ntry { s = JSON.parse(raw.split('\\n').pop()); } catch (e) { s = { ok: false, fatal: 'parse', raw: raw.slice(0, 200) }; }\nconst esc = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');\nconst notify = (!s.ok) || (s.notify === true);\nlet text;\nif (!s.ok) {\n  text = 'Agente Contenido ONIA - ERROR: ' + esc(s.fatal || 'desconocido');\n} else if (s.skipped) {\n  text = '';\n} else {\n  const p = s.preview || {};\n  const sc = p.script || {};\n  const cs = Array.isArray(p.carousels) ? p.carousels : [];\n  const L = [];\n  L.push('<b>Agente Contenido ONIA — ' + esc(s.day || '') + '</b>');\n  L.push('Pilar: ' + esc(s.pillar || ''));\n  L.push('');\n  L.push('<b>QUE GRABAR HOY (' + esc(sc.format || 'Reel') + ' · ' + esc(sc.duration || '') + ')</b>');\n  if (sc.hook) L.push('Gancho: ' + esc(sc.hook));\n  if (sc.body) L.push('Desarrollo: ' + esc(sc.body));\n  if (sc.cta) L.push('Cierre/CTA: ' + esc(sc.cta));\n  if (sc.on_screen) L.push('En pantalla: ' + esc(sc.on_screen));\n  if (sc.visual_prompt) L.push('Prompt visual: ' + esc(sc.visual_prompt));\n  if (sc.voice_tone) L.push('Voz/tono: ' + esc(sc.voice_tone));\n  for (let i = 0; i < cs.length; i++) {\n    const c = cs[i] || {};\n    L.push('');\n    L.push('<b>CARRUSEL ' + (i + 1) + ': ' + esc(c.title || '') + '</b>');\n    const slides = Array.isArray(c.slides) ? c.slides : [];\n    for (let j = 0; j < slides.length; j++) L.push((j + 1) + '. ' + esc(slides[j]));\n    if (c.cta) L.push('CTA: ' + esc(c.cta));\n  }\n  L.push('');\n  L.push((s.reviewsCreated || 0) + ' borrador(es) en revision en ONIA Center. Nada se publica ni se genera video sin tu OK.');\n  text = L.join('\\n').slice(0, 3900);\n}\nreturn [{ json: { notify: notify, text: text } }];"
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

export default workflow('onia-agente-contenido-media', 'ONIA - Agente Contenido y Media Lab (borradores)')
  .add(cronTrigger)
  .to(correrAgente)
  .to(prepararAviso)
  .to(hayAviso.onTrue(avisarSergio));
