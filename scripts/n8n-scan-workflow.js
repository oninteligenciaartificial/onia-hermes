#!/usr/bin/env node
"use strict";

const url = process.env.N8N_MCP_URL;
const token = process.env.N8N_MCP_TOKEN;
const WORKFLOW_ID = 'lryabRhGQW4WIuJG';
const PLACEHOLDER = 'REPLACE_WITH_TELEGRAM_CHAT_ID';

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
  return { status: res.status, ok: res.ok, data: parseSseJson(text), raw: text.slice(0, 1000) };
}

async function callTool(name, args) {
  return rpc('tools/call', { name, arguments: args });
}

async function main() {
  // Initialize
  const init = await rpc('initialize', {
    protocolVersion: '2025-03-26', capabilities: {},
    clientInfo: { name: 'hermes-scanner', version: '1.0.0' },
  });
  if (!init.ok) { console.error('init failed'); process.exit(1); }

  // Get full workflow details
  const det = await callTool('get_workflow_details', { workflowId: WORKFLOW_ID });
  const rawText = det.data?.result?.content?.[0]?.text || '';

  // Show all lines containing placeholder
  console.log(`=== Lines with ${PLACEHOLDER} ===`);
  rawText.split('\n').forEach((line, i) => {
    if (line.includes(PLACEHOLDER)) {
      console.log(`Line ${i + 1}: ${line.trim()}`);
    }
  });

  // Show all lines containing the chat ID (already set)
  console.log('\n=== Lines with 6830070978 (already set) ===');
  rawText.split('\n').forEach((line, i) => {
    if (line.includes('6830070978')) {
      console.log(`Line ${i + 1}: ${line.trim()}`);
    }
  });

  // Try to parse as JSON to find node structure
  console.log('\n=== Raw workflow text (first 4000 chars) ===');
  console.log(rawText.slice(0, 4000));
}

main().catch(e => { console.error(e); process.exit(1); });
