const fs = require('fs');
const path = require('path');
const SCRATCH = 'C:/Users/PC/AppData/Local/Temp/claude/C--dev-proyectos-onia-hermes--claude-worktrees-skills-setup-config-8d4674/03ac0c13-5c3c-47d8-8bb1-f0a99d9dd8a5/scratchpad';
const html = fs.readFileSync(path.join(SCRATCH, process.argv[2] || 'step1.html'), 'utf8');
const re = /<select\b[^>]*>([\s\S]*?)<\/select>/g;
let m; let i = 0;
while ((m = re.exec(html))) {
  i++;
  console.log('--- select', i, '---');
  const opts = [...m[1].matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g)];
  opts.forEach((o) => console.log(JSON.stringify(o[1]), '=>', o[2]));
}
