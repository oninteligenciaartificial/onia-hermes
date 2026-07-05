// Export SDK del workflow n8n "ONIA - Agente Vendedor (borradores)" (id C96NmbalLhaTEf0G).
// Cron Lun-Sab 08:30 La Paz -> SSH corre /opt/onia/sales-agent-run.sh (docker exec onia-center
// node sales-agent.mjs): lee leads, califica+redacta con LiteLLM, deja SOLO borradores
// (tarea + review_queue pending/sensitive/reviewer=sergio) y avisa a Sergio por Telegram.
// Recrear con create_workflow_from_code; luego setNodeCredential (sshPrivateKey, telegramApi).
import { workflow, node, trigger, ifElse, expr, newCredential } from '@n8n/workflow-sdk';

const cronTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.2,
  config: {
    name: 'Lun-Sab 08:30',
    parameters: { rule: { interval: [{ field: 'cronExpression', expression: '30 8 * * 1-6' }] } }
  },
  output: [{}]
});

const correrAgente = node({
  type: 'n8n-nodes-base.ssh',
  version: 1,
  config: {
    name: 'Correr Agente Vendedor (VPS)',
    parameters: {
      resource: 'command',
      operation: 'execute',
      authentication: 'privateKey',
      command: 'bash /opt/onia/sales-agent-run.sh',
      cwd: '/root'
    },
    credentials: { sshPrivateKey: newCredential('ONIA VPS SSH', '4XKauEX3b6cqaDhW') }
  },
  output: [{ stdout: '{"ok":true,"dryRun":false,"processed":0,"tasksCreated":0,"reviewsCreated":0,"drafts":[],"errors":[]}', code: 0, stderr: '' }]
});

const prepararAviso = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Preparar aviso',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: "const raw = ($input.first().json.stdout || '').trim();\nlet s;\ntry { s = JSON.parse(raw.split('\\n').pop()); } catch (e) { s = { ok: false, fatal: 'parse', raw: raw.slice(0, 200) }; }\nconst drafts = Array.isArray(s.drafts) ? s.drafts : [];\nconst errs = Array.isArray(s.errors) ? s.errors : [];\nconst notify = (!s.ok) || drafts.length > 0 || errs.length > 0;\nlet text;\nif (!s.ok) {\n  text = 'Agente Vendedor ONIA - ERROR: ' + (s.fatal || 'desconocido');\n} else {\n  const lines = ['Agente Vendedor ONIA: ' + drafts.length + ' borrador(es) para aprobar (' + (s.reviewsCreated || 0) + ' en cola, ' + (s.tasksCreated || 0) + ' tareas).'];\n  for (const d of drafts.slice(0, 8)) {\n    lines.push('');\n    lines.push('- ' + d.company + ' [' + d.qualification + '/' + d.priority + ']' + (d.has_proposal ? ' +propuesta' : ''));\n    lines.push('  Accion: ' + d.next_action);\n    lines.push('  Borrador: ' + (d.followup_preview || '').slice(0, 220));\n  }\n  if (errs.length) { lines.push(''); lines.push('Errores: ' + errs.length); }\n  lines.push('');\n  lines.push('Revisa y aproba en ONIA Center. Nada se envio.');\n  text = lines.join('\\n').slice(0, 3900);\n}\nreturn [{ json: { notify: notify, text: text } }];"
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
      chatId: expr('{{ $env.TELEGRAM_SERGIO_CHAT_ID }}'),
      text: expr('{{ $json.text }}'),
      additionalFields: { appendAttribution: false, disable_web_page_preview: true }
    },
    credentials: { telegramApi: newCredential('Telegram account', 'r8y2CN5RyOEIDce3') }
  },
  output: [{ ok: true }]
});

export default workflow('onia-agente-vendedor', 'ONIA - Agente Vendedor (borradores)')
  .add(cronTrigger)
  .to(correrAgente)
  .to(prepararAviso)
  .to(hayAviso.onTrue(avisarSergio));
