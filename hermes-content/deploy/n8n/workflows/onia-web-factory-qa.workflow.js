// ONIA - Web Factory QA (n8n). Live id: GFeCZKr1zQT6CVN8.
// Diario 08:00: SSH corre /opt/onia/web-factory-qa.sh (regenera los 6 demos y valida
// el HTML) y alerta a Telegram SOLO si un template se rompio. Credencial: ONIA VPS SSH.
import { workflow, node, trigger, ifElse, newCredential, expr } from "@n8n/workflow-sdk";

const dailyQa = trigger({
  type: "n8n-nodes-base.scheduleTrigger",
  version: 1.3,
  config: { name: "Diario 08:00", position: [240, 300], parameters: { rule: { interval: [{ field: "cronExpression", expression: "0 8 * * *" }] } } },
});

const qa = node({
  type: "n8n-nodes-base.ssh",
  version: 1,
  config: {
    name: "QA demos Web Factory",
    position: [540, 300],
    parameters: { resource: "command", operation: "execute", authentication: "privateKey", command: "sh /opt/onia/web-factory-qa.sh" },
    credentials: { sshPrivateKey: newCredential("ONIA VPS SSH") },
  },
});

const evalQa = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Evaluar QA",
    position: [840, 300],
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode:
        "const raw = items[0]?.json || {};\n" +
        "const stdout = String(raw.stdout || '').trim();\n" +
        "let q = null;\n" +
        "try { const s = stdout.indexOf('{'); q = s >= 0 ? JSON.parse(stdout.slice(s)) : null; } catch (e) { q = null; }\n" +
        "const exitCode = typeof raw.code === 'number' ? raw.code : (typeof raw.exitCode === 'number' ? raw.exitCode : 1);\n" +
        "let alert = false, message = '';\n" +
        "if (!q || exitCode !== 0) { alert = true; message = 'Web Factory QA: no se pudo evaluar (exitCode=' + exitCode + ')\\n' + String(raw.stderr || stdout).slice(-400); }\n" +
        "else if (q.ok === false) { alert = true; message = 'Web Factory QA: TEMPLATES ROTOS\\n' + (q.broken || 'ver detalle') + '\\n(' + q.checked + ' demos chequeados)'; }\n" +
        "return [{ json: { alert, ok: q ? q.ok : false, checked: q ? q.checked : 0, message } }];",
    },
  },
});

const isBroken = ifElse({
  version: 2.3,
  config: {
    name: "Roto?",
    position: [1140, 300],
    parameters: { conditions: { options: { caseSensitive: true, leftValue: "", typeValidation: "strict" }, conditions: [{ id: "alert", leftValue: expr("{{ $json.alert }}"), rightValue: true, operator: { type: "boolean", operation: "equals" } }], combinator: "and" } },
  },
});

const alertTg = node({
  type: "n8n-nodes-base.httpRequest",
  version: 4.4,
  config: {
    name: "Alerta Telegram",
    position: [1440, 220],
    parameters: {
      method: "POST",
      url: expr("{{ 'https://api.telegram.org/bot' + $env.TELEGRAM_BOT_TOKEN + '/sendMessage' }}"),
      sendBody: true, contentType: "json", specifyBody: "json",
      jsonBody: expr("{{ { chat_id: $env.TELEGRAM_SERGIO_CHAT_ID, text: $json.message, disable_web_page_preview: true } }}"),
      options: { timeout: 30000 },
    },
  },
});

export default workflow("onia-web-factory-qa", "ONIA - Web Factory QA")
  .add(dailyQa)
  .to(qa)
  .to(evalQa)
  .to(isBroken.onTrue(alertTg));
