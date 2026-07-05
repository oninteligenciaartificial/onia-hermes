// ONIA - Backup diario (n8n). Live id: gN7pQld6Lh3qAcTS.
// Diario 03:00: SSH corre /opt/onia/vps-backup.sh (dump Supabase DentalGest +
// export workflows/credenciales n8n -> /opt/onia/backups, rotacion 7 dias) y avisa
// a Telegram (OK con tamanos / FALLO). Off-site R2 pendiente. Credencial: ONIA VPS SSH.
import { workflow, node, trigger, newCredential, expr } from "@n8n/workflow-sdk";

const daily3am = trigger({
  type: "n8n-nodes-base.scheduleTrigger",
  version: 1.3,
  config: { name: "Diario 03:00", position: [240, 300], parameters: { rule: { interval: [{ field: "cronExpression", expression: "0 3 * * *" }] } } },
});

const backup = node({
  type: "n8n-nodes-base.ssh",
  version: 1,
  config: {
    name: "Backup VPS",
    position: [540, 300],
    parameters: { resource: "command", operation: "execute", authentication: "privateKey", command: "sh /opt/onia/vps-backup.sh" },
    credentials: { sshPrivateKey: newCredential("ONIA VPS SSH") },
  },
});

const summarize = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Resumen backup",
    position: [840, 300],
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode:
        "const raw = items[0]?.json || {};\n" +
        "const stdout = String(raw.stdout || '').trim();\n" +
        "let b = null;\n" +
        "try { const s = stdout.indexOf('{'); b = s >= 0 ? JSON.parse(stdout.slice(s)) : null; } catch (e) { b = null; }\n" +
        "const exitCode = typeof raw.code === 'number' ? raw.code : (typeof raw.exitCode === 'number' ? raw.exitCode : 1);\n" +
        "const ok = !!b && b.ok === true && exitCode === 0;\n" +
        "const mb = (n) => (Number(n) / 1048576).toFixed(2) + 'MB';\n" +
        "let message;\n" +
        "if (ok) {\n" +
        "  message = 'ONIA Backup: OK (' + b.ts + ')\\nSupabase=' + mb(b.supabaseBytes) + ' n8n=' + mb(b.n8nBytes) + '\\n' + b.files + ' archivos, ' + b.totalSize + ' en /opt/onia/backups (rotacion 7 dias)';\n" +
        "} else {\n" +
        "  message = 'ONIA Backup: FALLO\\nerrors=' + ((b && b.errors) || ('exitCode=' + exitCode)) + '\\n' + String(raw.stderr || stdout).slice(-400);\n" +
        "}\n" +
        "return [{ json: { ok, message } }];",
    },
  },
});

const notify = node({
  type: "n8n-nodes-base.httpRequest",
  version: 4.4,
  config: {
    name: "Aviso Telegram",
    position: [1140, 300],
    parameters: {
      method: "POST",
      url: expr("{{ 'https://api.telegram.org/bot' + $env.TELEGRAM_BOT_TOKEN + '/sendMessage' }}"),
      sendBody: true, contentType: "json", specifyBody: "json",
      jsonBody: expr("{{ { chat_id: $env.TELEGRAM_SERGIO_CHAT_ID, text: $json.message, disable_web_page_preview: true } }}"),
      options: { timeout: 30000 },
    },
  },
});

export default workflow("onia-backup-diario", "ONIA - Backup diario")
  .add(daily3am)
  .to(backup)
  .to(summarize)
  .to(notify);
