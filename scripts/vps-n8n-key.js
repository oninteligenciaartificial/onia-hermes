const { connectSsh, exec } = require('./lib/ssh');

connectSsh().then(async conn => {
  const r = await exec(conn, [
    'echo "=== N8N ENV ==="',
    // Check n8n .env or environment
    'cat /root/.n8n/.env 2>/dev/null | grep -v PASSWORD | grep -v SECRET | grep -i "api\\|key\\|token" || echo "no .env"',
    'echo "=== N8N CONFIG ==="',
    // Check n8n config.json
    'cat /root/.n8n/config 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(json.dumps({k:v for k,v in d.items() if any(x in str(k).lower() for x in [\'api\',\'key\',\'token\',\'auth\'])}, indent=2))" 2>/dev/null || echo "no config or not json"',
    'echo "=== N8N DOCKER ENV ==="',
    // Check docker container env vars for n8n
    'docker inspect n8n 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); env=d[0].get(\'Config\',{}).get(\'Env\',[]); [print(e) for e in env if any(x in e.upper() for x in [\'API\',\'KEY\',\'TOKEN\',\'AUTH\']) and \'PASSWORD\' not in e.upper() and \'SECRET\' not in e.upper()]" 2>/dev/null || echo "docker inspect failed"',
    'echo "=== N8N HERMES ENV ==="',
    // Check hermes .env for n8n key
    'grep -i "n8n\\|N8N" /root/.hermes/.env 2>/dev/null || echo "no n8n keys in hermes .env"',
    'echo "=== WORKFLOW FILE ==="',
    // Check if workflows are exported somewhere
    'find /root/.hermes /root/.n8n -name "*.json" 2>/dev/null | grep -i "radar\\|workflow\\|cron" | head -5'
  ].join(' ; '));
  console.log(r.stdout);
  if (r.stderr) console.log('STDERR:', r.stderr.substring(0, 300));
  conn.end();
}).catch(e => console.error('SSH:', e.message));
