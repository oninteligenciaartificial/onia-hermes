import { workflow, node, trigger, sticky, newCredential, expr } from '@n8n/workflow-sdk';

const radarTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: '07:00 Plan Sergio',
    parameters: {
      rule: {
        interval: [
          {
            field: 'days',
            daysInterval: 1,
            triggerAtHour: 7,
            triggerAtMinute: 0
          }
        ]
      }
    },
    position: [180, 120]
  },
  output: [{ scheduled: true, command: 'Plan Sergio hoy' }]
});

const radarInput = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Set Plan Sergio',
    parameters: {
      mode: 'manual',
      includeOtherFields: false,
      assignments: {
        assignments: [
          { id: 'chat-id-radar', name: 'chatId', value: '6830070978', type: 'string' },
          { id: 'command-radar', name: 'command', value: 'Plan Sergio hoy', type: 'string' }
        ]
      }
    },
    position: [480, 120]
  },
  output: [{ chatId: '6830070978', command: 'Plan Sergio hoy' }]
});

const queueTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: '08:00 Cola contenido',
    parameters: {
      rule: {
        interval: [
          {
            field: 'days',
            daysInterval: 1,
            triggerAtHour: 8,
            triggerAtMinute: 0
          }
        ]
      }
    },
    position: [180, 300]
  },
  output: [{ scheduled: true, command: 'Cola contenido diaria' }]
});

const queueInput = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Set Cola contenido',
    parameters: {
      mode: 'manual',
      includeOtherFields: false,
      assignments: {
        assignments: [
          { id: 'chat-id-queue', name: 'chatId', value: '6830070978', type: 'string' },
          { id: 'command-queue', name: 'command', value: 'Cola contenido diaria', type: 'string' }
        ]
      }
    },
    position: [480, 300]
  },
  output: [{ chatId: '6830070978', command: 'Cola contenido diaria' }]
});

const crmTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: '08:30 Seguimientos CRM',
    parameters: {
      rule: {
        interval: [
          {
            field: 'days',
            daysInterval: 1,
            triggerAtHour: 8,
            triggerAtMinute: 30
          }
        ]
      }
    },
    position: [180, 480]
  },
  output: [{ scheduled: true, command: 'Seguimientos ONIA hoy' }]
});

const crmInput = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Set Seguimientos CRM',
    parameters: {
      mode: 'manual',
      includeOtherFields: false,
      assignments: {
        assignments: [
          { id: 'chat-id-crm', name: 'chatId', value: '6830070978', type: 'string' },
          { id: 'command-crm', name: 'command', value: 'Seguimientos ONIA hoy', type: 'string' }
        ]
      }
    },
    position: [480, 480]
  },
  output: [{ chatId: '6830070978', command: 'Seguimientos ONIA hoy' }]
});

const approvalsTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: '10:00 Disponibilidad Sergio',
    parameters: {
      rule: {
        interval: [
          {
            field: 'days',
            daysInterval: 1,
            triggerAtHour: 10,
            triggerAtMinute: 0
          }
        ]
      }
    },
    position: [180, 660]
  },
  output: [{ scheduled: true, command: 'Disponibilidad Sergio hoy' }]
});

const approvalsInput = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Set Disponibilidad Sergio',
    parameters: {
      mode: 'manual',
      includeOtherFields: false,
      assignments: {
        assignments: [
          { id: 'chat-id-approvals', name: 'chatId', value: '6830070978', type: 'string' },
          { id: 'command-approvals', name: 'command', value: 'Disponibilidad Sergio hoy', type: 'string' }
        ]
      }
    },
    position: [480, 660]
  },
  output: [{ chatId: '6830070978', command: 'Disponibilidad Sergio hoy' }]
});

const copyTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: '15:00 Copy plataformas',
    parameters: {
      rule: {
        interval: [
          {
            field: 'days',
            daysInterval: 1,
            triggerAtHour: 15,
            triggerAtMinute: 0
          }
        ]
      }
    },
    position: [180, 840]
  },
  output: [{ scheduled: true, command: 'Platform Copy Queue' }]
});

const copyInput = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Set Copy plataformas',
    parameters: {
      mode: 'manual',
      includeOtherFields: false,
      assignments: {
        assignments: [
          { id: 'chat-id-copy', name: 'chatId', value: '6830070978', type: 'string' },
          { id: 'command-copy', name: 'command', value: 'Platform Copy Queue', type: 'string' }
        ]
      }
    },
    position: [480, 840]
  },
  output: [{ chatId: '6830070978', command: 'Platform Copy Queue' }]
});

const higgsfieldTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: '17:20 Modo gym',
    parameters: {
      rule: {
        interval: [
          {
            field: 'days',
            daysInterval: 1,
            triggerAtHour: 17,
            triggerAtMinute: 20
          }
        ]
      }
    },
    position: [180, 1020]
  },
  output: [{ scheduled: true, command: 'Modo gym' }]
});

const higgsfieldInput = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Set Modo gym',
    parameters: {
      mode: 'manual',
      includeOtherFields: false,
      assignments: {
        assignments: [
          { id: 'chat-id-higgsfield', name: 'chatId', value: '6830070978', type: 'string' },
          { id: 'command-higgsfield', name: 'command', value: 'Modo gym', type: 'string' }
        ]
      }
    },
    position: [480, 1020]
  },
  output: [{ chatId: '6830070978', command: 'Modo gym' }]
});

const logTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: '22:15 Cierre Sergio',
    parameters: {
      rule: {
        interval: [
          {
            field: 'days',
            daysInterval: 1,
            triggerAtHour: 22,
            triggerAtMinute: 15
          }
        ]
      }
    },
    position: [180, 1200]
  },
  output: [{ scheduled: true, command: 'Cierre Sergio' }]
});

const logInput = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Set Cierre Sergio',
    parameters: {
      mode: 'manual',
      includeOtherFields: false,
      assignments: {
        assignments: [
          { id: 'chat-id-log', name: 'chatId', value: '6830070978', type: 'string' },
          { id: 'command-log', name: 'command', value: 'Cierre Sergio', type: 'string' }
        ]
      }
    },
    position: [480, 1200]
  },
  output: [{ chatId: '6830070978', command: 'Cierre Sergio' }]
});

const runHermes = node({
  type: 'n8n-nodes-base.ssh',
  version: 1,
  credentials: {
    sshPassword: newCredential('SSH Password account')
  },
  config: {
    name: 'Run Hermes Scheduled Command',
    parameters: {
      resource: 'command',
      operation: 'execute',
      authentication: 'password',
      cwd: '/root/.hermes',
      command: "=python3 - <<'PY'\nimport json\nimport subprocess\nimport urllib.parse\n\nencoded = '''{{ encodeURIComponent($json.command) }}'''\nmsg = urllib.parse.unquote(encoded)\n\ntry:\n    proc = subprocess.run(\n        [\"hermes-command\", \"telegram\", \"--message\", msg],\n        cwd=\"/root/.hermes\",\n        capture_output=True,\n        text=True,\n        timeout=180,\n    )\n    stdout = (proc.stdout or \"\").strip()\n    stderr = (proc.stderr or \"\").strip()\n    try:\n        payload = json.loads(stdout) if stdout else {}\n    except Exception:\n        payload = {}\n    if not isinstance(payload, dict):\n        payload = {\"raw_stdout\": stdout}\n    payload.setdefault(\"ok\", proc.returncode == 0)\n    payload.setdefault(\"action\", msg)\n    if not payload.get(\"telegram_reply\"):\n        if stdout:\n            payload[\"telegram_reply\"] = stdout\n        elif stderr:\n            payload[\"telegram_reply\"] = \"Hermes Command Center error: \" + stderr[-1500:]\n        else:\n            payload[\"telegram_reply\"] = f\"Hermes Command Center termino sin salida. Codigo: {proc.returncode}\"\n    payload[\"exit_code\"] = proc.returncode\n    if stderr:\n        payload[\"stderr_tail\"] = stderr[-1500:]\nexcept Exception as exc:\n    payload = {\n        \"ok\": False,\n        \"action\": msg,\n        \"telegram_reply\": \"No pude ejecutar Hermes Command Center en el VPS: \" + str(exc),\n    }\n\nprint(json.dumps(payload, ensure_ascii=False))\nPY"
    },
    position: [780, 660]
  },
  output: [
    {
      code: 0,
      stdout: '{"ok":true,"telegram_reply":"Hermes scheduled reply"}',
      stderr: ''
    }
  ]
});

const formatReply = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Format Telegram Reply',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: "const item = $input.first().json;\nconst stdout = item.stdout || '';\nconst stderr = item.stderr || '';\nlet parsed = {};\ntry { parsed = JSON.parse(stdout); } catch (error) { parsed = {}; }\nlet text = parsed.telegram_reply || parsed.error || stdout || stderr || 'Hermes no devolvio respuesta.';\nif (text.length > 3600) text = text.slice(0, 3600) + '\\n\\n[recortado por Telegram]';\nreturn [{ json: { chatId: '6830070978', text, command: parsed.action || 'scheduled', ok: parsed.ok ?? (item.code === 0) } }];"
    },
    position: [1060, 660]
  },
  output: [
    {
      chatId: '6830070978',
      text: 'Hermes scheduled reply',
      command: 'scheduled',
      ok: true
    }
  ]
});

const sendReply = node({
  type: 'n8n-nodes-base.telegram',
  version: 1.2,
  credentials: {
    telegramApi: newCredential('Telegram account 2')
  },
  config: {
    name: 'Send Telegram Reply',
    parameters: {
      resource: 'message',
      operation: 'sendMessage',
      chatId: expr('{{ $json.chatId }}'),
      text: expr('{{ $json.text }}'),
      additionalFields: {
        appendAttribution: false,
        disable_web_page_preview: true
      }
    },
    position: [1340, 660]
  },
  output: [
    {
      ok: true,
      result: {
        message_id: 1,
        text: 'Hermes scheduled reply'
      }
    }
  ]
});

const safetyNote = sticky(
  '## ONIA Scheduled Operations Pack\nInternal Telegram reminders only. This workflow protects Sergio calendar, sales followups and operating records. Video Lab and Higgsfield are manual-only by default. This workflow never contacts prospects, never publishes content and never sends WhatsApp messages. Notion sync uses Hermes local outbox until a Notion credential exists in n8n.',
  [radarTrigger, queueTrigger, crmTrigger, approvalsTrigger, copyTrigger, higgsfieldTrigger, logTrigger],
  { color: 5 }
);

export default workflow('onia-scheduled-ops-pack-v1', 'ONIA - Scheduled Operations Pack')
  .add(radarTrigger)
  .to(radarInput)
  .to(runHermes)
  .to(formatReply)
  .to(sendReply)
  .add(queueTrigger)
  .to(queueInput)
  .to(runHermes)
  .add(crmTrigger)
  .to(crmInput)
  .to(runHermes)
  .add(approvalsTrigger)
  .to(approvalsInput)
  .to(runHermes)
  .add(copyTrigger)
  .to(copyInput)
  .to(runHermes)
  .add(higgsfieldTrigger)
  .to(higgsfieldInput)
  .to(runHermes)
  .add(logTrigger)
  .to(logInput)
  .to(runHermes)
  .add(safetyNote);
