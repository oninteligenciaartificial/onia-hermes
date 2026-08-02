const fs = require('fs');
const path = require('path');
const SCRATCH = 'C:/Users/PC/AppData/Local/Temp/claude/C--dev-proyectos-onia-hermes--claude-worktrees-skills-setup-config-8d4674/03ac0c13-5c3c-47d8-8bb1-f0a99d9dd8a5/scratchpad';
const html = fs.readFileSync(path.join(SCRATCH, process.argv[2] || 'step1.html'), 'utf8');
const re = /<(input|select|button|textarea)\b[^>]*>/g;
let m;
const out = [];
while ((m = re.exec(html))) {
  out.push(m[0]);
}
fs.writeFileSync(path.join(SCRATCH, 'fields-out.txt'), out.join('\n'));
console.log('count:', out.length);
