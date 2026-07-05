// Export SDK del workflow n8n "ONIA - Nuvia Sourcing Score (v1)" (id ECC1THa2kTmOGepY).
// Webhook POST /nuvia-candidato {secret,candidates[]} -> SSH corre /opt/onia/nuvia-score-run.sh
// (docker exec onia-center node nuvia-score.mjs): scorea cada candidato con el filtro
// ONIA-Bolivia (flete/arancel/demanda/precio), upsert en onia_center.nuvia_sourcing_candidates,
// y avisa a Sergio por Telegram. Read-only: NO contacta proveedores ni mueve dinero.
// Recrear con create_workflow_from_code; luego setNodeCredential (sshPrivateKey, telegramApi).
import { workflow, node, trigger, ifElse, expr, newCredential } from '@n8n/workflow-sdk';

const webhookNuvia = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Webhook Nuvia Candidatos',
    parameters: { httpMethod: 'POST', path: 'nuvia-candidato', responseMode: 'responseNode', options: {} }
  },
  output: [{ body: { secret: 'k', candidates: [{ title: 'x' }] } }]
});

const checkAuth = ifElse({
  version: 2.3,
  config: {
    name: 'Autorizado?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        combinator: 'and',
        conditions: [
          { id: 'cond-secret', leftValue: expr('{{ $json.body.secret }}'), rightValue: expr('{{ $env.ONIA_CENTER_INTERNAL_API_KEY }}'), operator: { type: 'string', operation: 'equals' } }
        ]
      }
    }
  },
  output: [{ body: { candidates: [] } }]
});

const encodeCandidatos = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Encode candidatos',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: "const body = $input.first().json.body || {};\nlet list = body.candidates;\nif (!Array.isArray(list)) list = list ? [list] : [];\nif (!list.length) { return [{ json: { ok: false, count: 0, b64: '' } }]; }\nconst b64 = Buffer.from(JSON.stringify(list)).toString('base64');\nreturn [{ json: { ok: true, count: list.length, b64: b64 } }];"
    }
  },
  output: [{ ok: true, count: 1, b64: 'W10=' }]
});

const scorearGuardar = node({
  type: 'n8n-nodes-base.ssh',
  version: 1,
  config: {
    name: 'Scorear + guardar (VPS)',
    parameters: {
      resource: 'command',
      operation: 'execute',
      authentication: 'privateKey',
      command: expr('bash /opt/onia/nuvia-score-run.sh "{{ $json.b64 }}"'),
      cwd: '/root'
    },
    credentials: { sshPrivateKey: newCredential('ONIA VPS SSH', '4XKauEX3b6cqaDhW') }
  },
  output: [{ stdout: '{"ok":true,"received":1,"saved":1,"candidates":[],"errors":[]}', code: 0, stderr: '' }]
});

const prepararAviso = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Preparar aviso Nuvia',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: "const raw = ($input.first().json.stdout || '').trim();\nlet s;\ntry { s = JSON.parse(raw.split('\\n').pop()); } catch (e) { s = { ok: false, fatal: 'parse' }; }\nconst cands = Array.isArray(s.candidates) ? s.candidates : [];\nlet text;\nif (!s.ok) {\n  text = 'Nuvia sourcing - ERROR: ' + (s.fatal || 'desconocido');\n} else {\n  const strong = cands.filter(function (c) { return c.verdict === 'strong'; }).length;\n  const lines = ['Nuvia sourcing: ' + (s.saved || 0) + '/' + (s.received || 0) + ' candidatos scoreados (' + strong + ' strong).'];\n  for (const c of cands.slice(0, 10)) { lines.push('- ' + c.title + ' -> ' + c.score + ' (' + c.verdict + ')'); }\n  if (Array.isArray(s.errors) && s.errors.length) { lines.push('Errores: ' + s.errors.length); }\n  lines.push('');\n  lines.push('Fichas en ONIA Center (nuvia_sourcing_candidates). Nada de contacto ni pago sin tu OK.');\n  text = lines.join('\\n').slice(0, 3900);\n}\nreturn [{ json: { ok: Boolean(s.ok), text: text, summary: s } }];"
    }
  },
  output: [{ ok: true, text: 'Nuvia sourcing: 1/1', summary: {} }]
});

const avisarSergio = node({
  type: 'n8n-nodes-base.telegram',
  version: 1.2,
  config: {
    name: 'Avisar a Sergio',
    parameters: {
      resource: 'message',
      operation: 'sendMessage',
      chatId: expr('{{ $env.TELEGRAM_SERGIO_CHAT_ID }}'),
      text: expr('{{ $json.text }}'),
      additionalFields: { appendAttribution: false, disable_web_page_preview: true }
    },
    credentials: { telegramApi: newCredential('Telegram account', 'r8y2CN5RyOEIDce3') }
  },
  output: [{ ok: true }]
});

const responderOk = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Responder OK',
    parameters: {
      respondWith: 'json',
      responseBody: expr('{{ $("Preparar aviso Nuvia").item.json.summary }}'),
      options: { responseCode: 200 }
    }
  },
  output: [{ ok: true }]
});

const responderNoAutorizado = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Responder No Autorizado',
    parameters: {
      respondWith: 'json',
      responseBody: expr('{{ { "ok": false, "reason": "unauthorized" } }}'),
      options: { responseCode: 401 }
    }
  },
  output: [{ ok: false }]
});

export default workflow('onia-nuvia-sourcing', 'ONIA - Nuvia Sourcing Score (v1)')
  .add(webhookNuvia)
  .to(checkAuth
    .onTrue(encodeCandidatos.to(scorearGuardar).to(prepararAviso).to(avisarSergio).to(responderOk))
    .onFalse(responderNoAutorizado));
