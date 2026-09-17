import { readFileSync, readdirSync, statSync, existsSync, globSync } from 'node:fs'
import path from 'node:path'

const RAIZ = process.cwd()
const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const EXCLUIR = new Set(['node_modules', '.git', '.next', 'out', 'dist', 'coverage'])

// universo: caminar el DISCO (no git ls-files: el archivo nuevo sin commitear es el sujeto)
function caminar(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUIR.has(e.name)) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) caminar(p, acc)
    else if (/\.test\.(mjs|js|ts|mts)$/.test(e.name)) acc.push(path.relative(RAIZ, p))
  }
  return acc
}
const universo = caminar(RAIZ).filter(p => !p.startsWith('web-factory/') && !p.startsWith('.agents/') && !p.startsWith('.claude/') && !p.includes('/skills/'))

// lo que la cadena EJECUTA: expandir cada script de `test`
const cadena = pkg.scripts.test.split('&&').map(s => s.trim().replace(/^npm run /, ''))
const ejecutados = new Set()
const noEntendidos = []
for (const nombre of cadena) {
  const cmd = pkg.scripts[nombre]
  if (!cmd) { noEntendidos.push(nombre + ' (script inexistente)'); continue }
  // rutas que aparecen como argumentos
  const tokens = cmd.split(/\s+/).filter(t => /[\/.]/.test(t) && !t.startsWith('-'))
  let vio = false
  for (const t of tokens) {
    const limpio = t.replace(/^["']|["']$/g, '')
    if (limpio.includes('*')) {
      // un glob no existe como ruta: se expande, si no el cableado se lee como ausente
      for (const f of globSync(limpio)) {
        if (/\.test\.(mjs|js|ts|mts)$/.test(f)) { ejecutados.add(f); vio = true }
      }
      continue
    }
    if (!existsSync(limpio)) continue
    const st = statSync(limpio)
    if (st.isDirectory()) { for (const f of caminar(path.resolve(limpio))) { ejecutados.add(f); vio = true } }
    else if (/\.test\.(mjs|js|ts|mts)$/.test(limpio)) { ejecutados.add(limpio); vio = true }
    else { vio = true } // script .mjs con self-check propio
  }
  if (!vio) noEntendidos.push(nombre)
}
const fuera = universo.filter(f => !ejecutados.has(f))
console.log('universo (disco):', universo.length)
console.log('ejecutados por la cadena:', ejecutados.size)
console.log('FUERA de la cadena:', fuera.length)
console.log('--- scripts cuyo comando no nombra una ruta de test ---')
console.log(noEntendidos.join('\n') || '(ninguno)')
console.log('--- primeros 40 fuera ---')
console.log(fuera.slice(0, 40).join('\n'))
