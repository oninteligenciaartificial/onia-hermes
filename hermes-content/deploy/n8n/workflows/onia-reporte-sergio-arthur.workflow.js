// Export SDK del workflow n8n "ONIA - Reporte diario Sergio + Arthur" (id xQaO3Sfsl9XzMiid).
// Cron Lun-Sab 07:00 La Paz -> SSH `docker exec -i onia-center node - < /opt/onia/arthur-report.mjs`:
// da las tareas del dia a Sergio y a Arthur (obligaciones del acuerdo 60 dias + CRM vivo) y
// verifica las ganancias de Arthur (payment_commissions por estado + ventas + progreso trial).
// Determinista (sin LLM); solo suma lo REGISTRADO. Telegram a Sergio.
// Recrear con create_workflow_from_code; luego setNodeCredential (sshPrivateKey, telegramApi).
import { workflow, node, trigger, expr, newCredential } from '@n8n/workflow-sdk';

const cronTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.2,
  config: { name: 'Lun-Sab 07:00', parameters: { rule: { interval: [{ field: 'cronExpression', expression: '0 7 * * 1-6' }] } } },
  output: [{}]
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
      jsCode: "const raw = ($input.first().json.stdout || '').trim();\nlet s;\ntry { s = JSON.parse(raw.split('\\n').pop()); } catch (e) { s = { ok: false, error: 'parse' }; }\nconst text = s.ok ? s.text : ('Reporte Arthur - ERROR: ' + (s.error || 'desconocido'));\nreturn [{ json: { text: text } }];"
    }
  },
  output: [{ text: 'ONIA - Plan del dia...' }]
});

const avisarSergio = node({
  type: 'n8n-nodes-base.telegram',
  version: 1.2,
  config: {
    name: 'Enviar a Sergio',
    parameters: { resource: 'message', operation: 'sendMessage', chatId: expr('{{ $env.TELEGRAM_SERGIO_CHAT_ID }}'), text: expr('{{ $json.text }}'), additionalFields: { appendAttribution: false, disable_web_page_preview: true } },
    credentials: { telegramApi: newCredential('Telegram account', 'r8y2CN5RyOEIDce3') }
  },
  output: [{ ok: true }]
});

export default workflow('onia-reporte-sergio-arthur', 'ONIA - Reporte diario Sergio + Arthur')
  .add(cronTrigger)
  .to(correrReporte)
  .to(extraerTexto)
  .to(avisarSergio);
