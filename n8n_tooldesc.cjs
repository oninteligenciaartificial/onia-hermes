const url = process.env.N8N_MCP_URL;
const token = process.env.N8N_MCP_TOKEN;
function parseSseJson(text) {
  const line = text.split(/\r?\n/).find(e => e.startsWith('data: '));
  if (!line) return null;
  return JSON.parse(line.slice(6));
}
let reqId = 1;
async function rpc(method, params) {
  const res = await fetch(url, { method: 'POST', headers: { authorization: `Bearer ${token}`, accept: 'application/json, text/event-stream', 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: reqId++, method, params }) });
  const text = await res.text();
  return parseSseJson(text);
}
(async () => {
  await rpc('initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'hermes-cli', version: '1.0.0' } });
  const r = await rpc('tools/list', {});
  const tools = r?.result?.tools || [];
  const t = tools.find(x => x.name === process.argv[2]);
  console.log(JSON.stringify(t, null, 2));
})();
