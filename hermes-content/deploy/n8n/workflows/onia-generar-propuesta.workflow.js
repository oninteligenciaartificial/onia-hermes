import { workflow, node, trigger, ifElse, expr, newCredential } from '@n8n/workflow-sdk';

const propuestaWebhook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Webhook Propuesta',
    parameters: {
      httpMethod: 'POST',
      path: 'generar-propuesta',
      responseMode: 'responseNode',
      options: {}
    }
  },
  output: [{ body: { slug: 'bench', secret: 'internal-key' }, headers: {}, query: {} }]
});

const checkAuth = ifElse({
  version: 2.3,
  config: {
    name: 'Autorizado y slug valido?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        combinator: 'and',
        conditions: [
          { id: 'cond-secret', leftValue: expr('{{ $json.body.secret }}'), rightValue: expr('{{ $env.ONIA_CENTER_INTERNAL_API_KEY }}'), operator: { type: 'string', operation: 'equals' } },
          { id: 'cond-slug', leftValue: expr('{{ $json.body.slug }}'), rightValue: '^[a-z0-9-]{1,60}$', operator: { type: 'string', operation: 'regex' } }
        ]
      }
    }
  },
  output: [{ body: { slug: 'bench', secret: 'internal-key' } }]
});

const generarPdf = node({
  type: 'n8n-nodes-base.ssh',
  version: 1,
  config: {
    name: 'Generar propuesta + PDF (VPS)',
    parameters: {
      resource: 'command',
      operation: 'execute',
      authentication: 'privateKey',
      command: expr('bash /opt/onia/generar-propuesta-pdf.sh "{{ $json.body.slug }}"'),
      cwd: '/root'
    },
    credentials: { sshPrivateKey: newCredential('ONIA VPS SSH', '4XKauEX3b6cqaDhW') }
  },
  output: [{ stdout: '{"ok":true,"slug":"bench","pdf_b64":"JVBERi0x..."}', code: 0, stderr: '' }]
});

const prepararBinario = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Preparar PDF binario',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: "const raw = ($input.first().json.stdout || '').trim();\nlet parsed;\ntry { parsed = JSON.parse(raw); } catch (e) { parsed = { ok: false, stage: 'parse' }; }\nif (!parsed || !parsed.ok) {\n  return [{ json: { ok: false, slug: (parsed && parsed.slug) || '', stage: (parsed && parsed.stage) || 'unknown' } }];\n}\nconst slug = parsed.slug;\nreturn [{ json: { ok: true, slug: slug }, binary: { data: { data: parsed.pdf_b64, fileName: 'propuesta-' + slug + '.pdf', mimeType: 'application/pdf', fileExtension: 'pdf' } } }];"
    }
  },
  output: [{ ok: true, slug: 'bench' }]
});

const checkPdf = ifElse({
  version: 2.3,
  config: {
    name: 'PDF generado?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
        combinator: 'and',
        conditions: [
          { id: 'cond-ok', leftValue: expr('{{ $json.ok }}'), rightValue: '', operator: { type: 'boolean', operation: 'true', singleValue: true } }
        ]
      }
    }
  },
  output: [{ ok: true, slug: 'bench' }]
});

const enviarTelegram = node({
  type: 'n8n-nodes-base.telegram',
  version: 1.2,
  config: {
    name: 'Enviar PDF a Sergio',
    parameters: {
      resource: 'message',
      operation: 'sendDocument',
      chatId: expr('{{ $env.TELEGRAM_SERGIO_CHAT_ID }}'),
      binaryData: true,
      binaryPropertyName: 'data',
      additionalFields: {
        caption: expr('Propuesta {{ $json.slug }} generada por ONIA. Revisar antes de enviar al cliente.'),
        fileName: expr('propuesta-{{ $json.slug }}.pdf')
      }
    },
    credentials: { telegramApi: newCredential('Telegram account', 'r8y2CN5RyOEIDce3') }
  },
  output: [{ ok: true, result: { message_id: 1 } }]
});

const responderOk = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Responder OK',
    parameters: {
      respondWith: 'json',
      responseBody: expr('{{ { "ok": true, "slug": $("Preparar PDF binario").item.json.slug, "delivered": "telegram" } }}'),
      options: { responseCode: 200 }
    }
  },
  output: [{ ok: true }]
});

const responderFallo = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Responder Fallo',
    parameters: {
      respondWith: 'json',
      responseBody: expr('{{ { "ok": false, "slug": $json.slug, "stage": $json.stage } }}'),
      options: { responseCode: 200 }
    }
  },
  output: [{ ok: false }]
});

const responderNoAutorizado = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Responder No Autorizado',
    parameters: {
      respondWith: 'json',
      responseBody: expr('{{ { "ok": false, "reason": "unauthorized_or_invalid_slug" } }}'),
      options: { responseCode: 401 }
    }
  },
  output: [{ ok: false }]
});

export default workflow('onia-generar-propuesta', 'ONIA - Generar Propuesta (oficial)')
  .add(propuestaWebhook)
  .to(checkAuth
    .onTrue(generarPdf.to(prepararBinario).to(checkPdf
      .onTrue(enviarTelegram.to(responderOk))
      .onFalse(responderFallo)))
    .onFalse(responderNoAutorizado));
