import { workflow, node, trigger, ifElse, newCredential, expr, sticky } from "@n8n/workflow-sdk";

const dailySchedule = trigger({
  type: "n8n-nodes-base.scheduleTrigger",
  version: 1.3,
  config: {
    name: "Lunes a sabado 07:10",
    position: [240, 300],
    parameters: {
      rule: {
        interval: [
          {
            field: "cronExpression",
            expression: "10 7 * * 1-6",
          },
        ],
      },
    },
  },
  output: [{}],
});

const runWorker = node({
  type: "n8n-nodes-base.ssh",
  version: 1,
  config: {
    name: "Run Web Factory worker on VPS",
    position: [540, 300],
    parameters: {
      resource: "command",
      operation: "execute",
      authentication: "privateKey",
      cwd: "/opt/onia-hermes/web-factory",
      // /opt/onia-hermes es un symlink al deploy real (/opt/onia-center-src).
      // Se invoca el runner por node directo (no `pnpm automation:vps:daily`)
      // para no depender del wrapper del package.json, que puede estar viejo en
      // el deploy. Los scripts internos (references:*, nuvia:*) si existen.
      command:
        "cd /opt/onia-hermes/web-factory && node scripts/web-factory-vps-automation.mjs --mode daily",
    },
    credentials: {
      sshPrivateKey: newCredential("ONIA VPS SSH"),
    },
  },
  output: [
    {
      code: 0,
      signal: null,
      stdout:
        '{"ok":true,"mode":"daily","runId":"2026-06-30T07-10-00-daily","reportPath":"/var/log/onia/web-factory/latest-web-factory-vps-automation.json","steps":[{"id":"references-harvest","ok":true},{"id":"references-intelligence","ok":true},{"id":"nuvia-price-check","ok":true}]}',
      stderr: "",
    },
  ],
});

const normalizeResult = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Normalize worker result",
    position: [840, 300],
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode:
        "const raw = items[0]?.json || {};\n" +
        "const stdout = String(raw.stdout || '').trim();\n" +
        "let parsed = null;\n" +
        "try {\n" +
        "  const start = stdout.indexOf('{');\n" +
        "  parsed = start >= 0 ? JSON.parse(stdout.slice(start)) : null;\n" +
        "} catch (error) {\n" +
        "  parsed = null;\n" +
        "}\n" +
        "const report = parsed || {};\n" +
        "const steps = Array.isArray(report.steps) ? report.steps : [];\n" +
        "const failedStep = steps.find((step) => !step.ok);\n" +
        "const exitCode = typeof raw.code === 'number' ? raw.code : 1;\n" +
        "const ok = exitCode === 0 && report.ok !== false && !failedStep;\n" +
        "const lines = [\n" +
        "  ok ? 'ONIA Web Factory VPS: OK' : 'ONIA Web Factory VPS: FALLO',\n" +
        "  `mode=${report.mode || 'daily'} runId=${report.runId || 'sin-run-id'}`,\n" +
        "  `exitCode=${exitCode} report=${report.reportPath || '/var/log/onia/web-factory/latest-web-factory-vps-automation.json'}`,\n" +
        "  failedStep ? `failedStep=${failedStep.id || 'unknown'}` : `steps=${steps.length}`,\n" +
        "];\n" +
        "if (raw.stderr) lines.push(String(raw.stderr).slice(-800));\n" +
        "return [{ json: { ok, exitCode, runId: report.runId || '', reportPath: report.reportPath || '', failedStep: failedStep?.id || '', message: lines.join('\\n').slice(0, 3900) } }];",
    },
  },
  output: [
    {
      ok: true,
      exitCode: 0,
      runId: "2026-06-30T07-10-00-daily",
      reportPath: "/var/log/onia/web-factory/latest-web-factory-vps-automation.json",
      failedStep: "",
      message: "ONIA Web Factory VPS: OK",
    },
  ],
});

const telegramConfigured = ifElse({
  version: 2.3,
  config: {
    name: "Telegram configured?",
    position: [1140, 300],
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: "", typeValidation: "strict" },
        conditions: [
          {
            id: "telegram-env-ready",
            leftValue: expr("{{ Boolean($env.TELEGRAM_BOT_TOKEN && $env.TELEGRAM_SERGIO_CHAT_ID) }}"),
            rightValue: true,
            operator: { type: "boolean", operation: "equals" },
          },
        ],
        combinator: "and",
      },
    },
  },
});

const workerOk = ifElse({
  version: 2.3,
  config: {
    name: "Worker OK?",
    position: [1440, 300],
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: "", typeValidation: "strict" },
        conditions: [
          {
            id: "worker-ok",
            leftValue: expr("{{ $json.ok }}"),
            rightValue: true,
            operator: { type: "boolean", operation: "equals" },
          },
        ],
        combinator: "and",
      },
    },
  },
});

const notifySuccess = node({
  type: "n8n-nodes-base.httpRequest",
  version: 4.4,
  config: {
    name: "Notify success Telegram",
    position: [1740, 180],
    parameters: {
      method: "POST",
      url: expr("{{ 'https://api.telegram.org/bot' + $env.TELEGRAM_BOT_TOKEN + '/sendMessage' }}"),
      sendBody: true,
      contentType: "json",
      specifyBody: "json",
      jsonBody: expr(
        "{{ { chat_id: $env.TELEGRAM_SERGIO_CHAT_ID, text: $json.message, disable_web_page_preview: true } }}",
      ),
      options: { timeout: 30000 },
    },
  },
  output: [{ ok: true, result: { message_id: 1001 } }],
});

const notifyFailure = node({
  type: "n8n-nodes-base.httpRequest",
  version: 4.4,
  config: {
    name: "Notify failure Telegram",
    position: [1740, 420],
    parameters: {
      method: "POST",
      url: expr("{{ 'https://api.telegram.org/bot' + $env.TELEGRAM_BOT_TOKEN + '/sendMessage' }}"),
      sendBody: true,
      contentType: "json",
      specifyBody: "json",
      jsonBody: expr(
        "{{ { chat_id: $env.TELEGRAM_SERGIO_CHAT_ID, text: $json.message, disable_web_page_preview: true } }}",
      ),
      options: { timeout: 30000 },
    },
  },
  output: [{ ok: true, result: { message_id: 1002 } }],
});

const noTelegramNote = sticky(
  "## Telegram no configurado\nSi TELEGRAM_BOT_TOKEN o TELEGRAM_SERGIO_CHAT_ID faltan, el workflow ejecuta el worker pero no notifica. Mantener logs en /var/log/onia/web-factory.",
  [telegramConfigured],
  { color: 3 },
);

export default workflow("onia-web-factory-vps-radar", "ONIA - Web Factory VPS Radar")
  .add(dailySchedule)
  .to(runWorker)
  .to(normalizeResult)
  .to(telegramConfigured.onTrue(workerOk.onTrue(notifySuccess).onFalse(notifyFailure)))
  .add(noTelegramNote);
