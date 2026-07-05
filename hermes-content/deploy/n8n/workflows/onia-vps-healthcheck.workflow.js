// ONIA - VPS Healthcheck (n8n). Live id: VaX3lx0zibnNbg57.
// Cada 2h: SSH corre /opt/onia/vps-healthcheck.sh y alerta a Telegram SOLO si hay
// problema (contenedores criticos caidos, disco/RAM altos). Recrear con el MCP de
// n8n: create_workflow_from_code. Credencial: ONIA VPS SSH.
import { workflow, node, trigger, ifElse, newCredential, expr } from "@n8n/workflow-sdk";

const every2h = trigger({
  type: "n8n-nodes-base.scheduleTrigger",
  version: 1.3,
  config: { name: "Cada 2 horas", position: [240, 300], parameters: { rule: { interval: [{ field: "cronExpression", expression: "0 */2 * * *" }] } } },
});

const check = node({
  type: "n8n-nodes-base.ssh",
  version: 1,
  config: {
    name: "Chequeo salud VPS",
    position: [540, 300],
    parameters: { resource: "command", operation: "execute", authentication: "privateKey", command: "sh /opt/onia/vps-healthcheck.sh" },
    credentials: { sshPrivateKey: newCredential("ONIA VPS SSH") },
  },
});

const evaluate = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Evaluar salud",
    position: [840, 300],
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode:
        "const raw = items[0]?.json || {};\n" +
        "const stdout = String(raw.stdout || '').trim();\n" +
        "let h = null;\n" +
        "try { const s = stdout.indexOf('{'); h = s >= 0 ? JSON.parse(stdout.slice(s)) : null; } catch (e) { h = null; }\n" +
        "const exitCode = typeof raw.code === 'number' ? raw.code : (typeof raw.exitCode === 'number' ? raw.exitCode : 0);\n" +
        "let alert = false; let message = '';\n" +
        "if (!h || exitCode !== 0) {\n" +
        "  alert = true;\n" +
        "  message = 'ONIA VPS Healthcheck: no se pudo leer estado (exitCode=' + exitCode + ').\\n' + String(raw.stderr || stdout).slice(-500);\n" +
        "} else if (h.ok === false) {\n" +
        "  alert = true;\n" +
        "  message = 'ONIA VPS: PROBLEMA\\n' + (h.problems || 'ver detalle') + '\\ndisco=' + h.disk + '% mem=' + h.mem + '%\\nRevisar: docker ps / df -h en 187.77.16.63';\n" +
        "}\n" +
        "return [{ json: { alert, ok: h ? h.ok : false, disk: h ? h.disk : null, mem: h ? h.mem : null, message } }];",
    },
  },
});

const hasProblem = ifElse({
  version: 2.3,
  config: {
    name: "Hay problema?",
    position: [1140, 300],
    parameters: { conditions: { options: { caseSensitive: true, leftValue: "", typeValidation: "strict" }, conditions: [{ id: "alert", leftValue: expr("{{ $json.alert }}"), rightValue: true, operator: { type: "boolean", operation: "equals" } }], combinator: "and" } },
  },
});

const alertTelegram = node({
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

export default workflow("onia-vps-healthcheck", "ONIA - VPS Healthcheck")
  .add(every2h)
  .to(check)
  .to(evaluate)
  .to(hasProblem.onTrue(alertTelegram));
