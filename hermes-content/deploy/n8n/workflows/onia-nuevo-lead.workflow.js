// Export SDK del workflow n8n "ONIA - Nuevo Lead (speed-to-lead)" (id WA6VkNu5OHo6Npem).
// Webhook POST /nuevo-lead {secret,company,contact,channel,message} -> SSH corre
// /opt/onia/intake-lead-run.sh (docker exec onia-center node intake-lead.mjs): crea el
// lead en onia_center.leads, lo califica + redacta la primera respuesta con LiteLLM, deja
// tarea + borrador en review_queue (pending/sensitive/reviewer=sergio) y avisa a Sergio.
// Bridge inbound (formulario/WhatsApp/Hermes) -> CRM -> Agente Vendedor. NO envia sin aprobacion.
// Recrear con create_workflow_from_code; luego setNodeCredential (sshPrivateKey, telegramApi).
import { workflow, node, trigger, ifElse, expr, newCredential } from '@n8n/workflow-sdk';

const webhookLead = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: { name: 'Webhook Nuevo Lead', parameters: { httpMethod: 'POST', path: 'nuevo-lead', responseMode: 'responseNode', options: {} } },
  output: [{ body: { secret: 'k', company: 'X', contact: 'y', channel: 'WhatsApp', message: 'z' } }]
});

const checkAuth = ifElse({
  version: 2.3,
  config: {
    name: 'Autorizado?',
    parameters: { conditions: {
      options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
      combinator: 'and',
      conditions: [ { id: 'cond-secret', leftValue: expr('{{ $json.body.secret }}'), rightValue: expr('{{ $env.ONIA_CENTER_INTERNAL_API_KEY }}'), operator: { type: 'string', operation: 'equals' } } ]
    } }
  },
  output: [{ body: { company: 'X' } }]
});

const encodeLead = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Encode lead',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: "const b = $input.first().json.body || {};\nconst lead = { company: b.company, contact: b.contact || null, channel: b.channel || 'Inbound', message: b.message || null, source: b.source || 'webhook' };\nif (!lead.company) { return [{ json: { ok: false, b64: '', error: 'no_company' } }]; }\nconst b64 = Buffer.from(JSON.stringify(lead)).toString('base64');\nreturn [{ json: { ok: true, b64: b64 } }];"
    }
  },
  output: [{ ok: true, b64: 'e30=' }]
});

const crearLead = node({
  type: 'n8n-nodes-base.ssh',
  version: 1,
  config: {
    name: 'Crear + calificar lead (VPS)',
    parameters: { resource: 'command', operation: 'execute', authentication: 'privateKey', command: expr('bash /opt/onia/intake-lead-run.sh "{{ $json.b64 }}"'), cwd: '/root' },
    credentials: { sshPrivateKey: newCredential('ONIA VPS SSH', '4XKauEX3b6cqaDhW') }
  },
  output: [{ stdout: '{"ok":true,"company":"X","qualification":"hot"}', code: 0, stderr: '' }]
});

const prepararAviso = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Preparar aviso',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: "const raw = ($input.first().json.stdout || '').trim();\nlet s;\ntry { s = JSON.parse(raw.split('\\n').pop()); } catch (e) { s = { ok: false, error: 'parse' }; }\nlet text;\nif (!s.ok) {\n  text = 'Nuevo Lead - ERROR: ' + (s.error || 'desconocido');\n} else {\n  text = ('Nuevo lead: ' + s.company + ' [' + s.qualification + '/' + s.priority + ']' + (s.has_proposal ? ' +propuesta' : '') + '\\n\\nAccion: ' + s.next_action + '\\n\\nBorrador de respuesta:\\n' + (s.followup_preview || '') + '\\n\\nAprobalo en ONIA Center -> Revisiones. Nada se envio.').slice(0, 3900);\n}\nreturn [{ json: { ok: Boolean(s.ok), text: text, summary: s } }];"
    }
  },
  output: [{ ok: true, text: 'Nuevo lead: X', summary: {} }]
});

const avisarSergio = node({
  type: 'n8n-nodes-base.telegram',
  version: 1.2,
  config: {
    name: 'Avisar a Sergio',
    parameters: { resource: 'message', operation: 'sendMessage', chatId: expr('{{ $env.TELEGRAM_SERGIO_CHAT_ID }}'), text: expr('{{ $json.text }}'), additionalFields: { appendAttribution: false, disable_web_page_preview: true } },
    credentials: { telegramApi: newCredential('Telegram account', 'r8y2CN5RyOEIDce3') }
  },
  output: [{ ok: true }]
});

const responderOk = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: { name: 'Responder OK', parameters: { respondWith: 'json', responseBody: expr('{{ $("Preparar aviso").item.json.summary }}'), options: { responseCode: 200 } } },
  output: [{ ok: true }]
});

const responderNoAutorizado = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: { name: 'Responder No Autorizado', parameters: { respondWith: 'json', responseBody: expr('{{ { "ok": false, "reason": "unauthorized" } }}'), options: { responseCode: 401 } } },
  output: [{ ok: false }]
});

export default workflow('onia-nuevo-lead', 'ONIA - Nuevo Lead (speed-to-lead)')
  .add(webhookLead)
  .to(checkAuth
    .onTrue(encodeLead.to(crearLead).to(prepararAviso).to(avisarSergio).to(responderOk))
    .onFalse(responderNoAutorizado));
