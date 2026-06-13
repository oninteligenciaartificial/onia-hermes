// Temporary: list n8n workflows and recent executions to extract chat IDs
const https = require('https');

const N8N_BASE = (process.env.N8N_MCP_URL || '').replace('/mcp-server/http', '');
const TOKEN = process.env.N8N_MCP_TOKEN || '';

if (!N8N_BASE || !TOKEN) {
  console.error('Missing N8N_MCP_URL or N8N_MCP_TOKEN env vars');
  process.exit(1);
}

function apiGet(path) {
  return new Promise((resolve, reject) => {
    const u = new URL(N8N_BASE + path);
    https.get(
      { hostname: u.hostname, path: u.pathname + u.search, headers: { 'X-N8N-API-KEY': TOKEN } },
      r => {
        let d = '';
        r.on('data', c => (d += c));
        r.on('end', () => {
          try { resolve(JSON.parse(d)); } catch (e) { resolve(d); }
        });
      }
    ).on('error', reject);
  });
}

async function main() {
  // 1. List workflows
  const wfs = await apiGet('/api/v1/workflows?limit=50');
  if (!wfs.data) { console.log('Workflows raw:', JSON.stringify(wfs).substring(0, 500)); return; }

  console.log('\n=== WORKFLOWS ===');
  wfs.data.forEach(w => console.log((w.active ? '[ON] ' : '[OFF]') + w.id + ' | ' + w.name));

  // 2. Get recent executions to find Telegram chat IDs
  console.log('\n=== RECENT EXECUTIONS (last 20) ===');
  const execs = await apiGet('/api/v1/executions?limit=20&includeData=false');
  if (execs.data) {
    execs.data.forEach(e => {
      const wf = wfs.data.find(w => w.id === e.workflowId);
      const name = wf ? wf.name : e.workflowId;
      console.log(`[${e.status}] ${e.id} | ${name} | ${e.startedAt}`);
    });
  }

  // 3. Find Telegram Command Center workflow and get its details
  const tgWf = wfs.data.find(w => w.name.toLowerCase().includes('telegram') || w.name.toLowerCase().includes('command'));
  if (tgWf) {
    console.log('\n=== TELEGRAM WORKFLOW DETAILS: ' + tgWf.name + ' ===');
    const detail = await apiGet('/api/v1/workflows/' + tgWf.id);
    // Look for chatId in nodes
    if (detail.nodes) {
      detail.nodes.forEach(n => {
        const params = JSON.stringify(n.parameters || {});
        if (params.includes('chatId') || params.includes('chat_id') || params.includes('telegram')) {
          console.log('Node:', n.name, '| Params snippet:', params.substring(0, 300));
        }
      });
    }
  }
}

main().catch(e => console.error('Error:', e.message));
