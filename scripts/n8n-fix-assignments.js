#!/usr/bin/env node
"use strict";

// Fix the ACTUAL assignment in Build Radar Brief - assignments.assignments[0].value
// The setNodeParameter only added a top-level telegramChatId param (not the assignment)

const url = process.env.N8N_MCP_URL;
const token = process.env.N8N_MCP_TOKEN;
const WORKFLOW_ID = 'lryabRhGQW4WIuJG';
const CHAT_ID = '6830070978';

function parseSseJson(text) {
  const line = text.split(/\r?\n/).find(e => e.startsWith('data: '));
  if (!line) return null;
  return JSON.parse(line.slice(6));
}

let reqId = 1;
async function rpc(method, params) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/json, text/event-stream',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: reqId++, method, params }),
  });
  const text = await res.text();
  return { status: res.status, ok: res.ok, data: parseSseJson(text), raw: text.slice(0, 500) };
}

async function callTool(name, args) {
  return rpc('tools/call', { name, arguments: args });
}

// The full radar prompt from the existing workflow
const RADAR_PROMPT = `=Ejecuta el radar diario de Hermes. Fecha: {{ $now.toISO() }}.

Reglas obligatorias:
- Sigue AGENTS.md, COORDINATION_MANIFEST.md, HERMES_EXECUTION_PROTOCOL.md y hermes-content/docs/ORCHESTRATOR.md.
- Mantener separado: Sergio personal, ONIA empresa/consultoria, Higgsfield como motor/servicio, clientes/prospectos.
- No mezclar precios, claims, mensajes ni comisiones entre marcas.
- No publicar, no contactar prospectos, no usar cara/voz de Sergio, no desplegar, no imprimir secretos.
- Si falta un dato, reporta el bloqueo tecnico y recomienda el siguiente paso.

Investiga novedades actuales usando busqueda web cuando sea necesario. Prioriza fuentes oficiales y recientes: Higgsfield, InVideo/Agent One, ElevenLabs, Instagram/Meta, TikTok Creative Center, YouTube/Creator Insider, OpenAI, n8n, tendencias de IA video, UGC, social ads, automatizacion y prospeccion.

Entrega en espanol, breve y accionable para Telegram, maximo 3500 caracteres:
1) Novedades utiles ordenadas por impacto.
2) 3 ideas de contenido para Sergio personal.
3) 3 ideas de contenido para ONIA.
4) 2 mejoras de prompts/workflow para Higgsfield.
5) 5 oportunidades o rubros de clientes a investigar sin contactar.
6) Riesgos/claims a evitar.
7) Acciones recomendadas para aprobacion con comandos exactos si aplica.

Cierra con: "No ejecute acciones client-facing."`;

async function main() {
  // Initialize
  const init = await rpc('initialize', {
    protocolVersion: '2025-03-26', capabilities: {},
    clientInfo: { name: 'hermes-fix-assignments', version: '1.0.0' },
  });
  if (!init.ok) { console.error('init failed'); process.exit(1); }
  console.log('MCP init OK');

  // Update the full assignments array with the correct chat ID
  console.log('\nUpdating Build Radar Brief assignments...');
  const update = await callTool('update_workflow', {
    workflowId: WORKFLOW_ID,
    operations: [
      {
        type: 'updateNodeParameters',
        nodeName: 'Build Radar Brief',
        parameters: {
          assignments: {
            assignments: [
              {
                id: 'telegram-chat-id',
                name: 'telegramChatId',
                value: CHAT_ID,
                type: 'string',
              },
              {
                id: 'radar-prompt',
                name: 'radarPrompt',
                value: RADAR_PROMPT,
                type: 'string',
              },
            ],
          },
        },
        replace: false,
      },
    ],
  });

  console.log('Status:', update.status);
  const resultText = update.data?.result?.content?.[0]?.text || '';
  console.log(resultText || update.raw);

  // Verify
  console.log('\nVerifying...');
  const verify = await callTool('get_workflow_details', { workflowId: WORKFLOW_ID });
  const vText = verify.data?.result?.content?.[0]?.text || '';

  // Parse and check the specific assignment
  try {
    const wf = JSON.parse(vText);
    const buildNode = wf.workflow.nodes.find(n => n.name === 'Build Radar Brief');
    const assignments = buildNode?.parameters?.assignments?.assignments || [];
    const chatAssignment = assignments.find(a => a.name === 'telegramChatId');
    console.log('telegramChatId assignment value:', chatAssignment?.value);
    console.log('Correctly set:', chatAssignment?.value === CHAT_ID);
  } catch {
    // Fallback text check
    console.log('Chat ID in workflow:', vText.includes(CHAT_ID));
    // Count remaining placeholders
    const remaining = (vText.match(/REPLACE_WITH_TELEGRAM_CHAT_ID/g) || []).length;
    console.log('Remaining placeholders:', remaining, '(should be 2: sticky note + IF condition check)');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
