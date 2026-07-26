// Export SDK del workflow n8n "ONIA - Agente Finanzas y Fondo ONIA".
// Cron Lun-Sab 07:15 La Paz -> SSH corre /opt/onia/finance-fund-agent-run.sh (docker exec
// onia-center node finance-fund-agent.mjs): agrega caja, ingresos del periodo, comisiones por
// estado y Fondo ONIA en onia_center.finance_summary (upsert diario) + pone agent_finance_fund
// en 'ready'. Determinista, READ-ONLY sobre la plata. Avisa a Sergio por Telegram SOLO si hay
// anomalias (pagos bloqueados, uso premium sin aprobar, gastos pendientes sin evidencia).
// El panel LEE la fila mas reciente de finance_summary (contrato ONIA_FINANCE_SUMMARY_CONTRACT.md).
// Recrear con create_workflow_from_code; luego setNodeCredential (sshPrivateKey, telegramApi).
import { workflow, node, trigger, ifElse, expr, newCredential } from '@n8n/workflow-sdk';

const cronTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.2,
  config: {
    name: 'Lun-Sab 07:15',
    parameters: { rule: { interval: [{ field: 'cronExpression', expression: '15 7 * * 1-6' }] } }
  },
  output: [{}]
});

const correrAgente = node({
  type: 'n8n-nodes-base.ssh',
  version: 1,
  config: {
    name: 'Correr Agente Finanzas (VPS)',
    parameters: {
      resource: 'command',
      operation: 'execute',
      authentication: 'privateKey',
      command: 'bash /opt/onia/finance-fund-agent-run.sh',
      cwd: '/root'
    },
    credentials: { sshPrivateKey: newCredential('ONIA VPS SSH', '4XKauEX3b6cqaDhW') }
  },
  output: [{ stdout: '{"ok":true,"summary_key":"fin-daily-2026-07-09","anomalies":[],"notify":false,"text":"..."}', code: 0, stderr: '' }]
});

const prepararAviso = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Preparar aviso',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: "const raw = ($input.first().json.stdout || '').trim();\nlet s;\ntry { s = JSON.parse(raw.split('\\n').pop()); } catch (e) { s = { ok: false, fatal: 'parse', raw: raw.slice(0, 200) }; }\n// Escribe el resumen a Supabase siempre (lo hace el runtime); Telegram SOLO si hay anomalias o error.\nconst notify = (!s.ok) || (s.notify === true);\nlet text;\nif (!s.ok) {\n  text = 'Agente Finanzas ONIA - ERROR: ' + (s.fatal || 'desconocido');\n} else {\n  const anomalies = Array.isArray(s.anomalies) ? s.anomalies : [];\n  text = (s.text || ('Agente Finanzas ONIA: resumen ' + (s.summary_key || '') + ' generado.')).slice(0, 3900);\n  if (anomalies.length) text = 'ANOMALIAS FINANZAS (' + anomalies.length + ') — accion requerida\\n\\n' + text;\n}\nreturn [{ json: { notify: notify, text: text } }];"
    }
  },
  output: [{ notify: false, text: '' }]
});

const hayAviso = ifElse({
  version: 2.3,
  config: {
    name: 'Hay anomalias que avisar?',
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

export default workflow('onia-agente-finanzas-fondo', 'ONIA - Agente Finanzas y Fondo ONIA')
  .add(cronTrigger)
  .to(correrAgente)
  .to(prepararAviso)
  .to(hayAviso.onTrue(avisarSergio));
