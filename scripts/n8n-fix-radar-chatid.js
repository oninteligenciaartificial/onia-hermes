#!/usr/bin/env node
"use strict";

// Fix Radar Diario: replace REPLACE_WITH_TELEGRAM_CHAT_ID with real chat ID
// Uses same pattern as n8n_mcp_healthcheck.js

const url = process.env.N8N_MCP_URL;
const token = process.env.N8N_MCP_TOKEN;
const WORKFLOW_ID = 'lryabRhGQW4WIuJG';
const CHAT_ID = '6830070978';
const NODE_NAME = 'Build Radar Brief';

if (!url || !token) {
  console.error('Missing N8N_MCP_URL or N8N_MCP_TOKEN');
  process.exit(1);
}

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
  const data = parseSseJson(text);
  return { status: res.status, ok: res.ok, data, raw: text.slice(0, 500) };
}

async function callTool(name, args) {
  return rpc('tools/call', { name, arguments: args });
}

async function main() {
  // 1. Initialize
  const init = await rpc('initialize', {
    protocolVersion: '2025-03-26',
    capabilities: {},
    clientInfo: { name: 'hermes-radar-fix', version: '1.0.0' },
  });
  if (!init.ok) {
    console.error('Initialize failed:', init.status, init.raw);
    process.exit(1);
  }
  console.log('MCP init OK');

  // 2. Get workflow details to find the node and current params
  console.log(`\nGetting workflow ${WORKFLOW_ID}...`);
  const det = await callTool('get_workflow_details', { workflowId: WORKFLOW_ID });
  if (!det.ok) {
    console.error('get_workflow_details failed:', det.status, det.raw);
    process.exit(1);
  }

  const content = det.data?.result?.content;
  const wfText = content?.[0]?.text || '';

  // Look for the placeholder
  const hasPlaceholder = wfText.includes('REPLACE_WITH_TELEGRAM_CHAT_ID');
  const hasRealId = wfText.includes(CHAT_ID);
  console.log(`Placeholder found: ${hasPlaceholder}`);
  console.log(`Chat ID already set: ${hasRealId}`);

  if (!hasPlaceholder && hasRealId) {
    console.log('\nWorkflow already has correct chat ID. Nothing to do.');
    return;
  }

  if (!hasPlaceholder) {
    console.log('\nWorkflow does not have placeholder. Showing relevant content:');
    // Find lines with telegramChatId
    const lines = wfText.split('\n').filter(l => l.toLowerCase().includes('telegram') || l.includes('chat'));
    console.log(lines.slice(0, 20).join('\n'));
    return;
  }

  // 3. Update the workflow node
  console.log(`\nUpdating node "${NODE_NAME}" in workflow...`);
  const update = await callTool('update_workflow', {
    workflowId: WORKFLOW_ID,
    operations: [
      {
        type: 'setNodeParameter',
        nodeName: NODE_NAME,
        path: '/telegramChatId',
        value: CHAT_ID,
      }
    ],
  });

  if (!update.ok) {
    console.error('update_workflow failed:', update.status, update.raw);

    // Try alternative: updateNodeParameters
    console.log('\nTrying updateNodeParameters...');
    const update2 = await callTool('update_workflow', {
      workflowId: WORKFLOW_ID,
      operations: [
        {
          type: 'updateNodeParameters',
          nodeName: NODE_NAME,
          parameters: { telegramChatId: CHAT_ID },
          replace: false,
        }
      ],
    });
    console.log('update2 status:', update2.status);
    console.log(update2.raw);
  } else {
    console.log('Update OK!');
    const resultText = update.data?.result?.content?.[0]?.text || '';
    console.log(resultText.slice(0, 1000));
  }

  // 4. Verify
  console.log('\nVerifying...');
  const verify = await callTool('get_workflow_details', { workflowId: WORKFLOW_ID });
  const vText = verify.data?.result?.content?.[0]?.text || '';
  console.log(`Chat ID present: ${vText.includes(CHAT_ID)}`);
  console.log(`Placeholder remains: ${vText.includes('REPLACE_WITH_TELEGRAM_CHAT_ID')}`);
}

main().catch(e => { console.error(e); process.exit(1); });
