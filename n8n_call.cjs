const url = process.env.N8N_MCP_URL;
const token = process.env.N8N_MCP_TOKEN;
function parseSseJson(text) {
  const line = text.split(/\r?\n/).find(e => e.startsWith('data: '));
  if (!line) return null;
  return JSON.parse(line.slice(6));
}
let reqId = 1;
async function rpc(method, params) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, accept: 'application/json, text/event-stream', 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: reqId++, method, params }),
  });
  const text = await res.text();
  const data = parseSseJson(text);
  return { status: res.status, ok: res.ok, data, raw: text };
}
async function callTool(name, args) { return rpc('tools/call', { name, arguments: args }); }
(async () => {
  await rpc('initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'hermes-cli', version: '1.0.0' } });
  const cmd = process.argv[2];
  const argsJson = process.argv[3] ? JSON.parse(process.argv[3]) : {};
  if (cmd === 'tools_list') {
    const r = await rpc('tools/list', {});
    console.log(JSON.stringify(r.data?.result?.tools?.map(t => ({name: t.name})), null, 2));
  } else {
    const r = await callTool(cmd, argsJson);
    if (r.data?.result?.content) {
      r.data.result.content.forEach(c => console.log(c.text || JSON.stringify(c)));
    } else {
      console.log('STATUS', r.status);
      console.log(r.raw);
    }
  }
})();
